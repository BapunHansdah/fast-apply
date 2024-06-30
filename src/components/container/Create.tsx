export default function Create({setSectionName,name}:any) {
  return (
    <div  className="flex flex-col p-2 ">
          {/* <p className="pb-2 text-gray-400 text-xs uppercase font-bold">
            Create a new {name}
          </p> */}
          <button onClick={() => setSectionName(name)} className="bg-gray-700 p-2 hover:bg-opacity-50  flex flex-col items-center justify-center text-gray-300  rounded-md gap-1">
          <span className="font-bold text-xs" >Create a new {name}</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 256 256"
            >
              <path
                fill="currentColor"
                d="M208 32H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16m-24 104h-48v48a8 8 0 0 1-16 0v-48H72a8 8 0 0 1 0-16h48V72a8 8 0 0 1 16 0v48h48a8 8 0 0 1 0 16"
              />
            </svg>
          </button>
        </div>
  )
}
