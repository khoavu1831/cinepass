function Button({ active, onClick, label }) {
  return (
    <>
      <button
        onClick={onClick}
        className={`flex justify-center items-center rounded-3xl px-3 text-[18px] opacity-90 cursor-pointer hover:opacity-100 h-11 w-28
              ${active ? " bg-white text-black" : "bg-[#2f3346] text-white"}
              `}
      >
        <span>{label}</span>
      </button>
    </>
  )
}

export default Button