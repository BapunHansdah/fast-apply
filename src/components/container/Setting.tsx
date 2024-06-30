import { useEffect, useState } from "react";
import GoBack from "./GoBack";

export default function Setting({ setSectionName }: any) {
  const [message, setMessage] = useState("");
  const [apiKey, setApiKey] = useState("");

  function clearStorage() {
    const sure = confirm("Are you sure you want to clear storage?");
    if (!sure) return;
    chrome.storage.local.set({ currentQueries: [] });
    chrome.storage.local.set({ templates: [] });
    chrome.storage.local.set({ profiles: [] });
    chrome.storage.local.set({ currentProfileDatas: [] });
    setMessage("Storage cleared");
    setTimeout(() => {
      setMessage("");
    }, 2000);
  }

  function goBack() {
    setSectionName("MAIN");
  }
  function SaveApiKey() {
    // const newApiKey = apiKey?.trim();
    // if (!newApiKey) return;
    chrome.storage.local.set({ fastApplyOpenApiKey: apiKey });
    setMessage("API Key saved");
  }

  useEffect(() => {
    chrome.storage.local.get(["fastApplyOpenApiKey"], (result) => {
      const apiKey = result.fastApplyOpenApiKey || "";
      if (apiKey) {
        setApiKey(apiKey);
      }
    });
  }, []);


  function handleFile(e: any) {
    if(!e.target.files[0]) return
    const file = e.target.files[0];
    importData(file);
  }

  function importData(file:any) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = (e.target as any).result;
      const data = JSON.parse(text);
      chrome.storage.local.set({ templates: data.templates });
      chrome.storage.local.set({ currentQueries: data.currentQueries });
      chrome.storage.local.set({ profiles: data.profiles });
      chrome.storage.local.set({ currentProfileDatas: data.currentProfileDatas });
    };
    reader.readAsText(file);
  }

  async function DownloadData() {
    const templates = await chrome.storage.local.get(["templates"]);
    const templateList = templates.templates || [];
    const queries = await chrome.storage.local.get(["currentQueries"]);
    const queryList = queries.currentQueries || [];
    const profiles = await chrome.storage.local.get(["profiles"]);
    const profileList = profiles.profiles || [];
    const ProfileDatas = await chrome.storage.local.get(["currentProfileDatas",])
    const profileDataList = ProfileDatas.currentProfileDatas || [];
    const data = {
      templates: templateList,
      currentQueries: queryList,
      profiles: profileList,
      currentProfileDatas: profileDataList
    };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fast-apply-data.json";
    link.click();
  }


  return (
    <div className="pt-2 px-2">
      <GoBack goBack={goBack} />
      <div className="text-xs mt-2 text-green-500">{message}</div>
      <div className="mt-2">
        <p className="text-gray-400 text-xs uppercase font-semibold">
          ADD YOUR API KEY
        </p>
        <p className="text-gray-400 text-xs">
          Get your api key from{" "}
          <span
            onClick={() =>
              window.open("https://platform.openai.com/account/api-keys")
            }
            className="text-blue-500 cursor-pointer"
          >
            https://platform.openai.com/api-keys
          </span>
        </p>
        <div className="flex gap-2 mt-2">
          <input
            onChange={(e) => setApiKey(e.target.value)}
            className="p-2 outline-none  rounded-sm bg-black w-full  text-white"
            type="text"
            value={apiKey}
          />
          <button
            onClick={() => SaveApiKey()}
            className="p-2 cursor-pointer flex gap-1 rounded-md text-xs items-center bg-gray-700 w-fit text-gray-300"
          >
            Save
          </button>
        </div>
      </div>
      <div className="mt-5">
        <p className="text-gray-400 text-xs uppercase font-semibold">
          Import data
        </p>
        <p className="text-gray-400 text-xs">
          Import data from your computer
        </p>
        <div className="flex gap-2 mt-2">

        <input
          type="file"
          accept=".json"
          className="p-2 outline-none  rounded-sm bg-black w-full  text-gray-300"
          onChange={(e) => handleFile(e)}
        />
        {/* <button  onClick={importData} className="p-2 cursor-pointer flex gap-1 rounded-md items-center text-xs bg-green-700 w-fit text-gray-300">
          Import
        </button> */}

        </div>
      </div>
      <div className="mt-5">
        <p className="text-gray-400 text-xs uppercase font-semibold">
          Back up your data
        </p>
        <p className="text-gray-400 text-xs">
          Your data will be stored in the JSON in your computer
        </p>
        <button onClick={() => DownloadData()} className="p-2 cursor-pointer flex items-center gap-1 rounded-md text-xs bg-gray-700 w-fit text-gray-300">
          Download
        </button>
      </div>
      <div className="mt-5">
        <p className="text-gray-400 text-xs uppercase font-semibold">
          Clear your storage
        </p>
        <p className="text-gray-400 text-xs">
        Your data will be permanently deleted from the app. Please ensure you have backed up your data before clearing your storage.</p>
        <button
          onClick={() => clearStorage()}
          className="p-2 bg-red-500 rounded-md flex items-center gap-2 text-white mt-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 48 48"
          >
            <g fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M22.062 25.602L11.33 5.416a1 1 0 1 1 1.766-.939l10.733 20.186l1.522-.81a4 4 0 0 1 5.41 1.655l.648 1.218l6.869 10.055l-14.249 7.576l-4.495-11.318l-.647-1.218a4 4 0 0 1 1.654-5.41zm-.583 2.575l4.81-2.557a2 2 0 0 1 2.705.827l.648 1.217l-8.343 4.436l-.647-1.218a2 2 0 0 1 .827-2.705m.83 6.432l2.753 6.933l1.834-.975l-2.165-4.215l1.78-.914l2.152 4.19l6.702-3.564l-4.208-6.16z"
                clip-rule="evenodd"
              />
              <path d="M16.36 35.231a1 1 0 0 1 1.28 1.537l-.001.001l-.002.002l-.003.002l-.01.008l-.03.025l-.103.079q-.131.1-.367.26c-.315.21-.77.484-1.344.758A11.15 11.15 0 0 1 11 39a1 1 0 1 1 0-2a9.15 9.15 0 0 0 3.92-.903a9 9 0 0 0 1.094-.617a6 6 0 0 0 .337-.24l.01-.01zm3.195 6.601a1 1 0 0 0-1.11-1.664l-.002.002l-.02.012l-.086.055q-.119.075-.349.207a14 14 0 0 1-1.27.642C15.65 41.561 14.299 42 13 42a1 1 0 1 0 0 2c1.702 0 3.35-.561 4.531-1.086a16 16 0 0 0 1.863-.979l.114-.072l.032-.021l.01-.006z" />
            </g>
          </svg>
          Clear storage
        </button>
      </div>
    </div>
  );
}
