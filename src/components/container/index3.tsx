import DynamicUI from "./DynamicUI";

export default function index() {

  const data = {
    extractedList: [
      { fieldName: "first name", value: "Bapun" },
      { fieldName: "last name", value: "Hansdah" },
      { fieldName: "location", value: "Mayurbhanj, Odisha" },
      { fieldName: "phone", value: "+91 8328821185" },
      { fieldName: "email", value: "bapunhansdah777@gmail.com" },
      { fieldName: "certifications", value: ["Hacker Rank (Javascript) (JAN 2023)", "Hacker Rank (React) (JAN 2023)", "Next Level's Certificate OF FEBRUARY’23 Achievement (Rank 10) (FEB 2023)"] },
      { fieldName: "education", value: ["+2 science", "Bachelors in Technology , Electrical and Communication Engineering"] },
      { fieldName: "technical skills", value: ["Vanilla Javascript", "React JS", "Next JS", "Css", "Tailwind", "Shadcn", "Ant design", "Mui", "BootStrap", "Mantine", "Shadcn", "Ant Design", "Node Js", "Express Js", "Rest API", "MongoDB", "Firebase", "AWS", "Azure VM", "EC2", "ELB", "Amplify", "S3", "CI/CD", "pipline", "Generative AI", "LLM", "Langchain", "Automation tools such as Puppeteer", "Selenium", "Familiar with Git and version control"] },
      {
        fieldName: "professional experience",
        value: [
          {
            company: "Niyutech Pvt Ltd",
            position: "Full Stack Developer",
            location: "Bangalore, India",
            duration: "August 2023 – Present",
            projects: [
              {
                name: "Unifill AI",
                description: "Developed a Chrome extension for browser automation using generative AI, streamlining repetitive tasks such as form filling. Built a MERN stack website to securely store user information utilized during the automation process. Ensured seamless integration and performance optimization of the web application. Collaborated with cross-functional teams to deliver the project on time and within scope."
              },
              {
                name: "Tutorio",
                description: "Developed a MERN stack web application to connect students and tutors, facilitating online teaching and learning. Implemented a scheduling system for seamless online tutoring sessions. Designed and developed responsive, user-friendly interfaces in collaboration with UI/UX designers. Ensured high-quality code and application performance through continuous testing and debugging. Participated in Agile development processes, contributing to sprint planning, daily stand-ups, and retrospectives."
              }
            ]
          },
          {
            company: "DogSwag",
            position: "MERN Stack Developer",
            location: "Bangalore, India",
            duration: "February 2023 – August 2023",
            projects: [
              {
                description: "Designed, developed, and deployed robust web applications using React.js and Next.js for the frontend, and integrated backend services developed in Go. Built a real-time chat system using Socket.io to facilitate communication between pet parents and veterinarians. Created engaging games to promote the product, significantly increasing revenue. Collaborated with UI/UX designers to create responsive and user-friendly interfaces. Maintained high-quality code, ensuring code quality through rigorous testing and code reviews. Optimized MongoDB databases for performance and data integrity. Actively participated in Agile/Scrum ceremonies, working closely with product managers and other developers. Identified and resolved bugs and performance issues, contributing to the continuous improvement of the product."
              }
            ]
          }
        ]
      }
    ]
  };


  return (
    <div className="max-w-sm">
        <DynamicUI data={data}/>
    </div>
  )
}
