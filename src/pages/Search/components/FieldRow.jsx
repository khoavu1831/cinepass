function FilterRow({ label, items, activeValue, category, handleSelect }) {
  return (
    <div className="flex flex-wrap justify-between py-2 px-4 text-sm gap-5">
      <div className="label flex justify-end md:w-30 max-md:w-20 ">
        <span className="text-white font-bold py-1 pr-3">{label}:</span>
      </div>

      <div className="flex flex-wrap justify-start gap-2 flex-1">
        {items.map((item, k) => {
          const isActive = Array.isArray(activeValue)
            ? activeValue.includes(item)
            : activeValue === item;
            
          return (
            <button
              key={k}
              onClick={() => handleSelect(category, item)}
              className={`cursor-pointer px-3 py-1 rounded-md font-mono 
                ${isActive
                  ? 'bg-mainblue text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`
              }
            >
              {item}
            </button>
          )

        })}
      </div>
    </div>
  )
}

export default FilterRow