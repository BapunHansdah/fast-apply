import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import GoBack from "./GoBack";

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
  const [search,setSearch] = useState("");

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
      const queries = currentList.filter(
        (l: any) => l.profileId === currentId
      );
      setCurrentList(queries);
    });

    chrome.storage.local.get(["profiles"], (result) => {
      const list = result.profiles || [];
      const currentProfile = list.find((l: any) => l.id === currentId);
      console.log(currentProfile, "currentProfile");
      setName(currentProfile?.name)
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

    try{
      const currentid = currentId || nanoid();

      const demoProfile: any = {
        id: currentid,
        name: name,
        color: generateRandomColor(),
      };

      const demoContent = {
        profileId: currentid,
        id: nanoid(),
        name: fieldName,
        value: value,
      };
      
      saveToStorage(demoProfile, demoContent);
      setCurrentId(currentid);
      setCurrentList([...currentList, demoContent]);
    } catch (error: any) {
      console.log(error);
      setErrorMsg(error.message || "Something went wrong. Please try again");
    }
  }


  async function saveToStorage(demoProfile: any, demoContent: any) {

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
      currentList.push(demoContent);
      chrome.storage.local.set({ currentProfileDatas: currentList });
    });
  }

  function deleteProfile(id:any){
    chrome.storage.local.get(["currentProfileDatas"], (result) => {
      const list = result.currentProfileDatas || [];
      const isProfileDataExist = list.findIndex(
        (l: any) => l.id === id
      );
      if (isProfileDataExist !== -1) {
        list.splice(isProfileDataExist, 1);
        chrome.storage.local.set({ currentProfileDatas: list });
      }
    });
    setCurrentList(currentList.filter((c: any) => c.id !== id));
  }


  const disabled = !fieldName || !value;

  return (
    <div className="flex flex-col p-2 w-full">
      <GoBack goBack={goBack} />
      <div>
        <input
          placeholder="Name of the profile"
          onChange={(e) => setName(e.target.value)}
          className="p-2 outline-none  rounded-sm bg-black w-full  text-gray-300"
          value={name}
        />
        <h3 className="font-bold mt-2">Add Fields</h3>

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
          onClick={saveProfile}
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
        <input onChange={(e) => setSearch(e.target.value)} className="text-xs p-1 bg-black w-full  text-gray-300" placeholder="search" />
      </div>
      <div className="mt-2 h-[390px] overflow-y-auto">
        <div className="grid grid-cols-6 text-gray-300 border-b p-1 border-gray-500 font-bold text-xs uppercase">
          <div className="col-span-2">Field Name</div>{" "}
          <div className="col-span-3">Value</div>{" "}
          <div className="col-span-1"></div>
        </div>
        {currentList.filter((f: any) => f.name.includes(search))?.map((f: any, i: any) => {
          return (
            <div
              key={i}
              className="grid grid-cols-6 text-gray-300 border-b p-1 border-gray-700 text-xs"
            >
              <div className="col-span-2 w-24 truncate">{f.name}</div>{" "}
              <div className="col-span-2 w-24 truncate">{f.value}</div>{" "}
              <div className="col-span-2 flex gap-2">
                <button onClick={()=>copyToClipboard(f.value)} className="px-2 font-bold bg-white text-black rounded-full ">
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
