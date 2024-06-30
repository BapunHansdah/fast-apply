import { useEffect } from "react";

export default function Profiles({
  list,
  setCurrentId,
  setSectionName,
  setList,
}: any) {


  function checkCurrentId(id: any) {
    setCurrentId(id);
    setSectionName("Profile");
  }

  useEffect(() => {
    chrome.storage.local.get(["profiles"], (result) => {
      const list = result.profiles || [];
      setList(list);
    });
  }, [setCurrentId]);

  function deleteProfile(id: any) {

    const confirm = window.confirm(
      "Are you sure you want to delete this profile?"
    )

    if (!confirm) {
      return
    }
    
    chrome.storage.local.get(["profiles"], (result) => {
      const profiles = result.profiles || [];
      const isQueryExist = profiles.findIndex((l: any) => l.id === id);
      if (isQueryExist !== -1) {
        profiles.splice(isQueryExist, 1);
        chrome.storage.local.set({ profiles: profiles });
      }
    });
    deleteAllQueriesWithProfileId(id);

    setList(list.filter((c: any) => c.id !== id));
  }

  function deleteAllQueriesWithProfileId(id: any) {
    chrome.storage.local.get(["currentProfileDatas"], (result) => {
      const queries = result.currentProfileDatas || [];
      //delete all queries having a profileId
      const newList = queries.filter((c: any) => c.profileId !== id);
      chrome.storage.local.set({ currentProfileDatas: newList });
    });
  }

  return (
    <div className="p-2">
      <p className="text-gray-400 text-xs uppercase font-semibold">Profiles</p>
      {
        list?.length < 1 && <div className="text-gray-400 text-xs  mt-2">No Profile Created yet.</div>
      }
      <ul className="mt-2 flex flex-wrap gap-2">
        {list.map((item: any, index: any) => (
          <li
            style={{ backgroundColor: item.color }}
            key={index}
            className={`px-3 flex gap-2 items-center cursor-pointer py-1 rounded-full text-xs shadow-lg group`}
          >
            <span onClick={() => checkCurrentId(item.id)}>{item.name}</span>
            <span
              onClick={()=>deleteProfile(item.id)}
              className="px-2 hidden group-hover:block"
            >
              x
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
