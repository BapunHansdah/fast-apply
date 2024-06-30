import { useEffect } from "react";

export default function Recent({ list,setCurrentId,setSectionName,setList }: any) {

  function checkCurrentId(id:any) {
    setCurrentId(id)
    setSectionName("Template")
  }
  
  useEffect(()=>{
    chrome.storage.local.get(["templates"], (result) => {
      const list = result.templates || [];
      setList(list)
    })
  },[setCurrentId])


    function deleteTemplate(id:any){
    
      const confirm = window.confirm(
        "Are you sure you want to delete this template?"
      )
  
      if (!confirm) {
        return
      }

    chrome.storage.local.get(["templates"], (result) => {
      const templates = result.templates || [];
      const isQueryExist = templates.findIndex(
        (l: any) => l.id === id
      );
      if (isQueryExist !== -1) {
        templates.splice(isQueryExist, 1);
        chrome.storage.local.set({ templates: templates });
      }
    });
    deleteAllQueriesWithTemplateId(id)

    setList(list.filter((c: any) => c.id !== id));
  }

  function deleteAllQueriesWithTemplateId(id:any){
    

    chrome.storage.local.get(["currentQueries"], (result) => {
      const queries = result.currentQueries || [];
      //delete all queries having a templateId
      const newList = queries.filter((c: any) => c.templateId !== id);
      chrome.storage.local.set({ currentQueries: newList });
    })
  }



  return (
    <div className="p-2">
      <p className="text-gray-400 text-xs uppercase font-semibold">Templates</p>
      {
        list?.length < 1 && <div className="text-gray-400 text-xs  mt-2">No Template Created yet.</div>
      }
      <ul className="mt-2 flex flex-col gap-2 h-[365px] overflow-y-auto">
         {list?.map((item: any) => {
          return (
            <li className="px-2 border border-gray-700 shadow-xl cursor-pointer py-4 hover:bg-gray-900 flex text-gray-300 rounded-md gap-2">
              <h3 onClick={()=>checkCurrentId(item.id)} className="font-bold w-full truncate">{item.name}</h3>
              <button  onClick={() => deleteTemplate(item.id)} className="bg-red-500 text-white w-fit flex items-center gap-2 font-semibold text-xs  px-2 rounded-sm">
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
