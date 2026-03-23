import React, { useState } from 'react';

const FILTER_DATA = {
  countries: ['Tất cả', 'Trung Quốc', 'Âu Mỹ', 'Hàn Quốc', 'Việt Nam', 'Nhật Bản', 'Thái Lan', 'Trung Quốc', 'Âu Mỹ', 'Hàn Quốc', 'Việt Nam', 'Nhật Bản', 'Thái Lan', 'Trung Quốc', 'Âu Mỹ', 'Hàn Quốc', 'Việt Nam', 'Nhật Bản', 'Thái Lan'],
  types: ['Tất cả', 'Phim lẻ', 'Phim bộ'],
  ratings: ['Tất cả', 'P', 'K', 'T13', 'T16', 'T18'],
  genres: ['Tất cả', 'Chính kịch', 'Hài hước', 'Hành động', 'Kinh dị', 'Cổ trang'],
  years: ['Tất cả', '2025', '2024', '2023', '2022', '2021', '2020'],
  sort: ['Mới nhất', 'Điểm IMDb', 'Lượt xem']
};

function Fieldset() {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    country: 'Tất cả',
    type: 'Tất cả',
    rating: 'Tất cả',
    genre: 'Tất cả',
    year: 'Tất cả',
    sort: 'Mới nhất'
  });

  const handleSelect = (category, value) => {
    setFilters(prev => ({ ...prev, [category]: value }));
  };

  const FilterRow = ({ label, items, activeValue, category }) => (
    <div className="flex flex-wrap justify-between py-2 px-4">
      <div className="label flex ">
        <span className="text-white font-bold py-1 pr-3">{label}:</span>
      </div>
      <div className="flex flex-wrap justify-start gap-2 flex-1">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => handleSelect(category, item)}
            className={`cursor-pointer px-3 py-1 rounded-md text-[18px] font-mono ${activeValue === item
                ? 'bg-mainblue text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="">
      <div
        className="flex items-center text-white font-medium text-xl gap-2 mb-6 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`fa-solid fa-filter ${isOpen ? 'text-mainblue' : ''}`}></i>
        <h1>Bộ lọc</h1>
      </div>

      {isOpen && (
        <div className="">
          <FilterRow label="Quốc gia" items={FILTER_DATA.countries} activeValue={filters.country} category="country" />
          <FilterRow label="Loại phim" items={FILTER_DATA.types} activeValue={filters.type} category="type" />
          <FilterRow label="Xếp hạng" items={FILTER_DATA.ratings} activeValue={filters.rating} category="rating" />
          <FilterRow label="Thể loại" items={FILTER_DATA.genres} activeValue={filters.genre} category="genre" />
          <FilterRow label="Năm sản xuất" items={FILTER_DATA.years} activeValue={filters.year} category="year" />
          <FilterRow label="Sắp xếp" items={FILTER_DATA.sort} activeValue={filters.sort} category="sort" />

          <div className="flex">
            <button className="bg-mainblue cursor-pointer hover:opacity-90 text-white font-medium py-2 px-6 rounded-full flex items-center gap-2 transition-colors">
              Lọc kết quả <i className="fa-solid fa-arrow-right"></i>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="border border-gray-600 text-white py-2 px-8 rounded-full hover:bg-gray-800 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Fieldset;