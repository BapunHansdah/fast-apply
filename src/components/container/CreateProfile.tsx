import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import GoBack from "./GoBack";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
export default function CreateProfile({
  currentId,
  setCurrentId,
  setSectionName,
}: {
  setSectionName: any;
  currentId: any;
  setCurrentId: any;
}) {
  const [name, setName] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [value, setValue] = useState("");
  const [currentList, setCurrentList] = useState<any>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(["fastApplyOpenApiKey"], (result) => {
      const apiKey = result.fastApplyOpenApiKey || "N/A";
      if (apiKey) {
        setOpenaiApiKey(apiKey);
      }
    });
  }, []);

  // function addFields() {
  //   if (!fieldName || !value) {
  //     return;
  //   }
  //   const NewFields = {
  //     id:nanoid(),
  //     fieldName,
  //     value,
  //   };
  //   setFieldList([...fieldList, NewFields]);
  //   setFieldName("")
  //   setValue("")
  // }

  useEffect(() => {
    if (currentId) {
      getCurrentIdAllQueries();
    }
  }, []);

  const generateRandomColor = () => {
    //only deep colors
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  function getCurrentIdAllQueries() {
    chrome.storage.local.get(["currentProfileDatas"], (result) => {
      const currentList = result.currentProfileDatas || [];
      const queries = currentList.filter((l: any) => l.profileId === currentId);
      setCurrentList(queries);
    });

    chrome.storage.local.get(["profiles"], (result) => {
      const list = result.profiles || [];
      const currentProfile = list.find((l: any) => l.id === currentId);
      console.log(currentProfile, "currentProfile");
      setName(currentProfile?.name);
    });
  }

  function goBack() {
    setSectionName("MAIN");
    setCurrentId(null);
  }

  function copyToClipboard(content: any) {
    navigator.clipboard.writeText(content);
  }

  async function saveProfile() {
    if (!name) {
      setErrorMsg("Please add your profile name");
      return "Please add your profile name";
    }

    if (!fieldName || !value) {
      setErrorMsg("Please add a fieldName and value");
      return "Please add a fieldName and value";
    }

    try {
      const currentid = currentId || nanoid();

      const demoProfile: any = {
        id: currentid,
        name: name,
        color: generateRandomColor(),
      };

      const demoContent = {
        profileId: currentid,
        id: nanoid(),
        fieldName: fieldName,
        value: value,
      };

      saveToStorage(demoProfile, demoContent,null);
      setCurrentId(currentid);
      setCurrentList([...currentList, demoContent]);
    } catch (error: any) {
      console.log(error);
      setErrorMsg(error.message || "Something went wrong. Please try again");
    }
  }

  async function extractContent() {

    if (!name) {
      setErrorMsg("Please add your profile name");
      return "Please add your profile name";
    }

    if (!resumeText) {
      setErrorMsg("Please add a fieldName and value");
      return "Please add a fieldName and value";
    }

    if(resumeText.length < 10) {
      setErrorMsg("Resume text is too short");
      return "Resume text is too short";
    }

    setLoading(true);
    const llm = new ChatOpenAI({
      modelName: "gpt-3.5-turbo-1106",
      maxTokens: 1024,
      apiKey: openaiApiKey,
      temperature: 0,
    });

    try {
      const format = {
        extractedList: [
          {
            fieldName: "first name",
            value: "John",
          },
          {
            fieldName: "last name",
            value: "Doe",
          },
        ]
      };

      const systemMessage = new SystemMessage(
        `
        With 10 years of experience as a Data Extractor, I assist you in extracting data from your job resume or text.
        Always response in strictly in this JSON format:
        "${JSON.stringify(format)}"
        IMPORTANT GUIDELINE:
        DO NOT CREATE NESTED JSON OBJECTS.
        EXTRACT BASIC INFORMATION OF USER ONLY.
        ALWAYS KEEP VALUES BE IN CAMEL CASE.
        `
      );

      const aiMessage1 = new HumanMessage({
        content: `Here is my resume: ${resumeText}`,
      });

      const message = new HumanMessage({ content: resumeText });
      const res = await llm.invoke([systemMessage,aiMessage1,message]);
      const unparsedContent = res.lc_kwargs.content;
      console.log(unparsedContent);
      //update the field name and value in the chrome
      const parsedContent =  JSON.parse(unparsedContent);
      const extractedList = parsedContent.extractedList;
      const currentid = currentId || nanoid();

      const demoProfile: any = {
        id: currentid,
        name: name,
        color: generateRandomColor(),
      };


      extractedList.forEach(async (l: any) => {
        l.id = nanoid();
        l.profileId = currentid;
      })

      await saveToStorage(demoProfile,null, extractedList);
      setCurrentList([...currentList, ...extractedList]);
      setLoading(false);
      
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      setErrorMsg(error.message || "Something went wrong. Please try again");
    }
  }

  async function saveToStorage(demoProfile: any, demoContent: any, extractedList: any) {
    chrome.storage.local.get(["profiles"], (result) => {
      const list = result.profiles || [];
      const isProfileExist = list.findIndex(
        (l: any) => l.id === demoProfile.id
      );
      if (isProfileExist === -1) {
        list.push(demoProfile);
      } else {
        list[isProfileExist] = demoProfile;
      }
      chrome.storage.local.set({ profiles: list });
    });
    
    chrome.storage.local.get(["currentProfileDatas"], (result) => {
      const currentList = result.currentProfileDatas || [];
      if(extractedList) {
        extractedList.forEach((l: any) => {
          currentList.push(l);
        })
      }else {
        currentList.push(demoContent);
      }
      chrome.storage.local.set({ currentProfileDatas: currentList });
    });
  }

  function deleteProfile(id: any) {
    chrome.storage.local.get(["currentProfileDatas"], (result) => {
      const list = result.currentProfileDatas || [];
      const isProfileDataExist = list.findIndex((l: any) => l.id === id);
      if (isProfileDataExist !== -1) {
        list.splice(isProfileDataExist, 1);
        chrome.storage.local.set({ currentProfileDatas: list });
      }
    });
    setCurrentList(currentList.filter((c: any) => c.id !== id));
  }

  const disabled = !fieldName || !value;
  const disabledExtract = !resumeText || loading ;

  return (
    <div className="flex flex-col p-2 w-full h-[490px] overflow-y-auto">
      <GoBack goBack={goBack} />
      <div>
        <input
          placeholder="Name of the profile"
          onChange={(e) => setName(e.target.value)}
          className="p-2 outline-none  rounded-sm bg-black w-full  text-gray-300"
          value={name}
        />

        <h3 className="font-bold mt-2">Add Fields</h3>

        <div>
          <p className="text-gray-300 text-xs mt-2">
            Extract data from your resume or any other text
          </p>
          <textarea
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your texts here"
            className="p-2 outline-none  rounded-sm bg-black w-full h-32 text-white"
            value={resumeText}
          />

          <button
            onClick={() => extractContent()}
            className={` ${disabledExtract ? "bg-gray-900 opacity-40" : ""}  px-4 rounded-sm bg-gray-700 mt-2`}
          >
           {loading ? "Extracting..." : "Extract"}
          </button>
        </div>

        <div className="flex gap-2 mt-2 items-center w-full">
           <span className="border-b border-gray-300 w-5/12"></span>
           <span className="text-gray-300 w-2/12 text-center">OR</span>
           <span className="border-b border-gray-300 w-5/12"></span>
        </div>

        <p className="text-gray-300 text-xs mt-2">
            Add your data manually
          </p>
        <div className="mt-2 flex gap-2">
          <input
            onChange={(e) => setFieldName(e.target.value)}
            value={fieldName}
            placeholder="fieldName"
            className="p-2 outline-none  rounded-sm bg-black w-full  text-gray-300"
          />
          <input
            onChange={(e) => setValue(e.target.value)}
            value={value}
            placeholder="Value"
            className="p-2 outline-none  rounded-sm bg-black w-full  text-gray-300"
          />
        </div>

        <button
          onClick={()=>saveProfile()}
          disabled={disabled}
          className={`${
            disabled ? "bg-gray-900 opacity-40" : ""
          }  px-4 rounded-sm bg-gray-700  mt-2`}
        >
          Add
        </button>

        {errorMsg ? (
          <p className="text-red-500 text-xs py-2">{errorMsg}</p>
        ) : null}
      </div>
      <div className="mt-3">
        <input
          onChange={(e) => setSearch(e.target.value)}
          className="text-xs p-1 bg-black w-full  text-gray-300"
          placeholder="search"
        />
      </div>
      <div className="mt-2 ">
        <div className="grid grid-cols-6 text-gray-300 border-b p-1 border-gray-500 font-bold text-xs uppercase">
          <div className="col-span-2">Field Name</div>{" "}
          <div className="col-span-3">Value</div>{" "}
          <div className="col-span-1"></div>
        </div>
        {currentList
          .filter((f: any) => f?.fieldName?.includes(search))
          ?.map((f: any, i: any) => {
            return (
              <div
                key={i}
                className="grid grid-cols-6 text-gray-300 border-b p-1 border-gray-700 text-xs"
              >
                <div className="col-span-2 w-24 truncate">{f.fieldName}</div>{" "}
                <div className="col-span-2 w-24 truncate">{f.value}</div>{" "}
                <div className="col-span-2 flex gap-2">
                  <button
                    onClick={() => copyToClipboard(f.value)}
                    className="px-2 font-bold bg-white text-black rounded-full "
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => deleteProfile(f.id)}
                    className="px-2 font-bold bg-red-500 text-white rounded-full "
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

const profiles = [
  {
    name: "Profile 1",
    email: "Profile1@email.com",
    phone: "8328821185",
  },
  {
    name: "Profile 2",
    email: "Profile2@email.com",
    phone: "8328821185",
  },
];

console.log(profiles);
