
export default function GoBack({goBack}:any) {
  return (
    <div
        onClick={() => goBack()}
        className="p-2 flex gap-1 text-xs cursor-pointer font-semibold items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 48 48"
        >
          <path
            fill="currentColor"
            fill-rule="evenodd"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="4"
            d="M44 40.836c-4.893-5.973-9.238-9.362-13.036-10.168c-3.797-.805-7.412-.927-10.846-.365V41L4 23.545L20.118 7v10.167c6.349.05 11.746 2.328 16.192 6.833c4.445 4.505 7.009 10.117 7.69 16.836Z"
            clip-rule="evenodd"
          />
        </svg>
        Back
      </div>
  )
}
