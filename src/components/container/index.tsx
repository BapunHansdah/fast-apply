import { useEffect, useRef, useState } from "react";
import Create from "./Create";
import Header from "./Header";
import Recent from "./Recent";
import CreateTemplate from "./CreateTemplate";
import Setting from "./Setting";
import Createprofile from "./CreateProfile";
import Profiles from "./Profiles";

function index() {
  const [list, setList] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [profileList, setProfileList] = useState([]);
  const [currentProfileId, setCurrentProfileId] = useState(null);
  const [sectionName, setSectionName] = useState("MAIN");
  const [showContainer, setShowContainer] = useState(false);
  const headerRef = useRef(null);
  const containerRef = useRef(null);
  const iconRef = useRef(null);
  const iconHandle = useRef(null);

  function openSetting() {
    setSectionName("Settings");
  }

  useEffect(() => {
    const header: any = headerRef.current;
    const container: any = containerRef.current;
    if (!header) return;
    if (!container) return;
    const handleMouseDown = (event: any) => {
      const rect = header.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const handleMouseMove = (event: any) => {
        const dx = event.clientX - x;
        const dy = event.clientY - y;
        container.style.left = `${dx}px`;
        container.style.top = `${dy}px`;
      };

      document.addEventListener("mousemove", handleMouseMove);

      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", handleMouseMove);
      });

      event.preventDefault();
    };

    header.addEventListener("mousedown", handleMouseDown);
  }, [showContainer]);

  useEffect(() => {
    const header: any = iconHandle.current;
    const container: any = iconRef.current;
    if (!header) return;
    if (!container) return;
    const handleMouseDown = (event: any) => {
      const rect = header.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const handleMouseMove = (event: any) => {
        const dx = event.clientX - x;
        const dy = event.clientY - y;
        container.style.left = `${dx}px`;
        container.style.top = `${dy}px`;
      };

      document.addEventListener("mousemove", handleMouseMove);

      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", handleMouseMove);
      });

      event.preventDefault();
    };

    header.addEventListener("mousedown", handleMouseDown);
  }, [showContainer]);

  if (!showContainer) {
    return (
      <div
        ref={iconRef}
        className="group  w-[50px] h-[50px] fixed right-2 bottom-10"
      >
        <div className="flex h-[50px] gap-2 w-[50px] cursor-pointer flex-col items-center justify-center rounded-full text-black text-xl font-bold bg-amber-200 shadow-lg group-hover:h-[80px]">
          <div ref={iconHandle} className="hidden group-hover:block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M5 3H3v2h2zm14 4h2v6h-2V9H9v10h4v2H7V7zM7 3h2v2H7zM5 7H3v2h2zm-2 4h2v2H3zm2 4H3v2h2zm6-12h2v2h-2zm6 0h-2v2h2zm-2 14v-2h6v2h-2v2h-2v2h-2zm4 2v2h2v-2z"
              />
            </svg>
          </div>
          <div
            onClick={() => setShowContainer(true)}
            className="flex items-center"
          >
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
            <div className="-ml-1 uppercase italic">FA</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="bg-black w-[350px] h-[500px] fixed right-2 bottom-10 text-white rounded-3xl shadow-lg"
    >
      <Header
        headerRef={headerRef}
        setShowContainer={setShowContainer}
        openSetting={openSetting}
      />
      <div className="bg-gray-800 h-full rounded-b-2xl">
        {sectionName === "Template" ? (
          <CreateTemplate
            currentId={currentId}
            setCurrentId={setCurrentId}
            setSectionName={setSectionName}
          />
        ) : sectionName === "Profile" ? (
          <Createprofile
            setSectionName={setSectionName}
            setCurrentId={setCurrentProfileId}
            currentId={currentProfileId}
          />
        ) : sectionName === "Settings" ? (
          <Setting setSectionName={setSectionName} />
        ) : (
          <div>
            <div className="grid grid-cols-2">
            <Create setSectionName={setSectionName} name={"Profile"} />
            <Create setSectionName={setSectionName} name={"Template"} />
            </div>
            <Profiles
              setSectionName={setSectionName}
              setCurrentId={setCurrentProfileId}
              list={profileList}
              setList={setProfileList}
            />
            <Recent
              setSectionName={setSectionName}
              setCurrentId={setCurrentId}
              list={list}
              setList={setList}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default index;
