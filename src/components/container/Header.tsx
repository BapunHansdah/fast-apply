export default function Header({openSetting,setShowContainer,headerRef}:any) {
  return (
    <div ref={headerRef} className="p-2 border-dashed flex justify-between items-center">
      <div className="uppercase flex justify-start items-center text-amber-100 font-bold text-xl italic">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 36 36"
        >
          <path
            fill="currentColor"
            d="M10.52 34h-3a1 1 0 0 1-.88-1.44L12.55 21H6a1 1 0 0 1-.85-1.54l10.68-17a1 1 0 0 1 .81-.46h13.43a1 1 0 0 1 .77 1.69L21.78 14h5.38a1 1 0 0 1 .73 1.66l-16.63 18a1 1 0 0 1-.74.34m-1.34-2h.91l14.77-16h-5.27a1 1 0 0 1-.77-1.69L27.88 4H17.19L7.77 19h6.43a1 1 0 0 1 .88 1.44Z"
            className="clr-i-outline clr-i-outline-path-1"
          />
          <path fill="none" d="M0 0h36v36H0z" />
        </svg>
        Fast Apply
      </div>
      <div className="flex items-center gap-3">
      <div onClick={() => openSetting()} className="cursor-pointer flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 48 48"
        >
          <defs>
            <mask id="ipSSetting0">
              <g fill="none" stroke-linejoin="round" stroke-width="4">
                <path
                  fill="#fff"
                  stroke="#fff"
                  d="M36.686 15.171a15.37 15.37 0 0 1 2.529 6.102H44v5.454h-4.785a15.37 15.37 0 0 1-2.529 6.102l3.385 3.385l-3.857 3.857l-3.385-3.385a15.37 15.37 0 0 1-6.102 2.529V44h-5.454v-4.785a15.37 15.37 0 0 1-6.102-2.529l-3.385 3.385l-3.857-3.857l3.385-3.385a15.37 15.37 0 0 1-2.529-6.102H4v-5.454h4.785a15.37 15.37 0 0 1 2.529-6.102l-3.385-3.385l3.857-3.857l3.385 3.385a15.37 15.37 0 0 1 6.102-2.529V4h5.454v4.785a15.37 15.37 0 0 1 6.102 2.529l3.385-3.385l3.857 3.857z"
                />
                <path
                  fill="#000"
                  stroke="#000"
                  d="M24 29a5 5 0 1 0 0-10a5 5 0 0 0 0 10Z"
                />
              </g>
            </mask>
          </defs>
          <path
            fill="currentColor"
            d="M0 0h48v48H0z"
            mask="url(#ipSSetting0)"
          />
        </svg>
      </div>
      <div onClick={() => setShowContainer(false)} className="cursor-pointer flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
          />
        </svg>
      </div>
      </div>
    </div>
  );
}
