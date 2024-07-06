import { useEffect, useRef, useState } from "react";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { nanoid } from "nanoid";
import GoBack from "./GoBack";
// import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { createRetrievalChain } from "langchain/chains/retrieval";
// import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
// import { ChatPromptTemplate } from "@langchain/core/prompts";

export default function CreateTemplate({
  setSectionName,
  currentId,
  setCurrentId,
}: {
  setSectionName: any;
  currentId: any;
  setCurrentId: any;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [jobApplicationText, setJobApplicationText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [text, setText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [currentList, setCurrentList] = useState<any>([]);
  const createTemplateRef: any = useRef(null);
  const [loading, setLoading] = useState(false);
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [name,setName]  = useState("")

  function scrollToBottom() {
    if (createTemplateRef.current) {
      createTemplateRef.current.scrollTop =
        createTemplateRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    if (currentId) {
      getCurrentIdAllQueries();
    }
  }, []);

  function getCurrentIdAllQueries() {
    
    chrome.storage.local.get(["currentQueries"], (result) => {
      const currentList = result.currentQueries || [];
      console.log(currentList, "currentList");
      const queries = currentList.filter(
        (l: any) => l.templateId === currentId
      );
      setCurrentList(queries);
    });
    chrome.storage.local.get(["templates"], (result) => {
      const list = result.templates || [];
      const currentTemplate = list.find((l: any) => l.id === currentId);
      console.log(currentTemplate, "currentTemplate");
      setJobApplicationText(currentTemplate?.jobApplicationText || "");
      setResumeText(currentTemplate?.resumeText || "");
      setName(currentTemplate?.name || "");
    });
  }

  function createNewQuestion(question: any) {
    setIsCreating(true);
    setText(question);
  }
  const format = {
    Title: "Short title Of the context max 3 to 4 words",
    Answer: "Your Answer",
  };
  const systemMessage = new SystemMessage(
    `
    With 10 years of experience as a professional job application helper, I assist users in crafting responses to questions based on the company's job description and the user's provided resume.
    Always response in strictly in this JSON format:
    "${JSON.stringify(format)}"
    `
  );


  useEffect(() => {
    chrome.storage.local.get(["fastApplyOpenApiKey"], (result) => {
      const apiKey = result.fastApplyOpenApiKey || "N/A";
      if (apiKey) {
        setOpenaiApiKey(apiKey);
      }
    });
  }, []);
  



  async function gptRequest() {


    if (!name) {
      setErrorMsg("Please add a question");
      return "Please add a question";
    }

    if (!jobApplicationText || !resumeText) {
      setErrorMsg("Please add your job application and resume first");
      return "Please add your job application and resume first";
    }
    if (!text) {
      setErrorMsg("Please add a question");
      return "Please add a question";
    }

    setErrorMsg("");
    setLoading(true);
    try {

      const llm = new ChatOpenAI({
        modelName: "gpt-3.5-turbo-1106",
        maxTokens: 1024,
        apiKey: openaiApiKey,
        temperature: 0,
      });

      const aiMessage1 = new HumanMessage({
        content: `Here is job application: ${jobApplicationText}`,
      });
      const aiMessage2 = new HumanMessage({
        content: `Here is my resume: ${resumeText}`,
      });
      const message = new HumanMessage({ content: text });
      const res = await llm.invoke([
        systemMessage,
        aiMessage1,
        aiMessage2,
        message,
      ]);
      const unparsedContent = res.lc_kwargs.content;
      console.log(unparsedContent);

      const content = JSON.parse(unparsedContent);
      // const content = "some random answer";
      const currentid = currentId || nanoid();

      const demoTemplate: any = {
        id: currentid,
        name: name,
        jobApplicationText,
        resumeText,
      };

      const demoContent = {
        templateId: currentid,
        id: nanoid(),
        name: text,
        content: content.Answer,
      };

      saveToStorage(demoTemplate, demoContent);
      setCurrentId(currentid);
      setCurrentList([...currentList, demoContent]);
      scrollToBottom();
      setLoading(false);
      return content;
    } catch (error:any) {
      console.log(error);
      setLoading(false);
      setErrorMsg( error.message || "Something went wrong. Please try again");
    }
  }

  async function saveToStorage(demoTemplate: any, demoContent: any) {

    chrome.storage.local.get(["templates"], (result) => {
      const list = result.templates || [];
      const isTemplateIdExist = list.findIndex(
        (l: any) => l.id === demoTemplate.id
      );
      if (isTemplateIdExist === -1) {
        list.push(demoTemplate);
      } else {
        list[isTemplateIdExist] = demoTemplate;
      }
      chrome.storage.local.set({ templates: list });
    });

    chrome.storage.local.get(["currentQueries"], (result) => {
      const currentList = result.currentQueries || [];
      currentList.push(demoContent);
      chrome.storage.local.set({ currentQueries: currentList });
    });
  }

  function goBack() {
    setSectionName("MAIN");
    setCurrentId(null);
  }

  function copyToClipboard(content: any) {
    navigator.clipboard.writeText(content);
  }

  function deleteTemplate(id:any){
    chrome.storage.local.get(["currentQueries"], (result) => {
      const list = result.currentQueries || [];
      const isQueryExist = list.findIndex(
        (l: any) => l.id === id
      );
      if (isQueryExist !== -1) {
        list.splice(isQueryExist, 1);
        chrome.storage.local.set({ currentQueries: list });
      }
    });
    setCurrentList(currentList.filter((c: any) => c.id !== id));
  }

  const disabled = loading || !text || !jobApplicationText || !resumeText || !name;


  return (
    <div ref={createTemplateRef} className="h-[490px] overflow-y-auto">
      {openaiApiKey === "N/A" ? (
        <div className="bg-red-500 p-2 text-white text-xs">
          Api key not found, Add your api key
          <span onClick={()=>setSectionName("Settings")} className="text-blue-700 cursor-pointer">{` here`}</span>
        </div>
      ) : null}
      <GoBack goBack={goBack} />
      <div className="p-2 flex flex-col gap-2">
        
      <input
          placeholder="Name of the template"
          onChange={(e) => setName(e.target.value)}
          className="p-2 outline-none  rounded-sm bg-black w-full  text-gray-300"
          value={name}
        />

        <div className="font-bold text-gray-300 italic">~ Job Description</div>
        <textarea
          onChange={(e) => setJobApplicationText(e.target.value)}
          placeholder="Paste your job description here"
          className="p-2  outline-none rounded-sm bg-black w-full h-32 text-white"
          value={jobApplicationText}
        />
      </div>
      <div className="p-2 flex flex-col gap-2">
        <div className="font-bold text-gray-300 italic">~ Your Resume</div>
        <textarea
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume texts here"
          className="p-2 outline-none  rounded-sm bg-black w-full h-32 text-white"
          value={resumeText}
        />
      </div>
      <div className="p-2 flex flex-wrap gap-2">
        <span
          onClick={() => createNewQuestion("Create me a Cover Letter")}
          className="p-1 px-3 cursor-pointer rounded-md text-xs bg-amber-100 text-black"
        >
          Create me a Cover Letter
        </span>
        <span
          onClick={() => createNewQuestion("Why should we hire you?")}
          className="p-1 px-3 cursor-pointer rounded-md text-xs bg-amber-100 text-black"
        >
          Why should we hire you?
        </span>
        <span
          onClick={() => createNewQuestion("Why do you want to join?")}
          className="p-1 px-3 cursor-pointer rounded-md text-xs bg-amber-100 text-black"
        >
          Why do you want to join?
        </span>
        <button
          onClick={() => createNewQuestion("")}
          className="p-1 px-3 cursor-pointer flex gap-1 rounded-md text-xs bg-gray-700 w-fit text-gray-300"
        >
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 256 256"
          >
            <path
              fill="currentColor"
              d="M208 32H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16m-24 104h-48v48a8 8 0 0 1-16 0v-48H72a8 8 0 0 1 0-16h48V72a8 8 0 0 1 16 0v48h48a8 8 0 0 1 0 16"
            />
          </svg>
          Create Question
        </button>
      </div>
      {isCreating ? (
        <div className="p-2">
          <textarea
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder="Type your question here"
            className="p-2 outline-none  rounded-sm bg-black w-full h-20 text-white"
          />
          {errorMsg ? (
            <p className="text-red-500 text-xs py-2">{errorMsg}</p>
          ) : null}

          <button
            disabled={disabled}
            onClick={gptRequest}
            className={` ${
              disabled ? "bg-gray-900 opacity-40" : ""
            } w-full p-2 bg-gray-700 text-gray-300 rounded-md hover:bg-opacity-75`}
          >
            {loading ? "Thinking..." : "Submit"}
          </button>
        </div>
      ) : null}
      <div className="p-2">
        <p className="text-gray-400 text-xs uppercase font-semibold">Query</p>
        <ul className="mt-2 flex flex-col gap-2 h-[450px] overflow-y-auto">
          {currentList?.map((item: any) => {
            return (
              <li className="px-2 border border-gray-700 shadow-xl cursor-pointer py-4 hover:bg-gray-900 flex text-gray-300 rounded-md gap-2">
                <h3 className="font-bold w-full truncate">{item.name}</h3>
                <button
                  onClick={() => copyToClipboard(item.content)}
                  className="bg-white w-fit flex items-center gap-2 font-semibold text-xs text-gray-700 px-2 rounded-sm"
                >
                  Copy
                </button>
                <button 
                onClick={()=>deleteTemplate(item.id) }
                className="bg-red-500 w-fit flex items-center gap-2 font-semibold text-xs text-white px-2 rounded-sm">
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
