import React, { useState } from 'react';
import FilterRow from './FieldRow';

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
    country: ['Tất cả'],
    type: ['Tất cả'],
    rating: ['Tất cả'],
    genre: ['Tất cả'],
    year: ['Tất cả'],
    sort: 'Mới nhất'
  });

  const handleSelect = (category, value) => {
    setFilters(prev => {
      const currentSelection = prev[category];

      if (category === 'sort') return { ...prev, [category]: value };

      if (value === 'Tất cả') return { ...prev, [category]: ['Tất cả'] };

      // Xử lý chọn nhiều
      let newSelection = Array.isArray(currentSelection) 
        ? currentSelection.filter(item => item !== 'Tất cả')
        : [];

      if (newSelection.includes(value)) {
        newSelection = newSelection.filter(item => item !== value);
        if (newSelection.length === 0) newSelection = ['Tất cả'];
      } else {
        newSelection.push(value);
      }

      return { ...prev, [category]: newSelection };
    });
  };

  return (
    <fieldset className={isOpen ? "border border-gray-700 rounded-xl" : ""}>
      <legend
        className="flex items-center text-white font-medium text-md gap-2 mb-6 cursor-pointer select-none px-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`fa-solid fa-filter ${isOpen ? 'text-mainblue' : ''}`}></i>
        <h1 className=''>Bộ lọc</h1>
      </legend>

      {isOpen && (
        <div className="space-y-1">
          <FilterRow label="Quốc gia" items={FILTER_DATA.countries} activeValue={filters.country} handleSelect={handleSelect} category="country" />
          <hr className="border-gray-800 border-dashed" />
          <FilterRow label="Loại phim" items={FILTER_DATA.types} activeValue={filters.type} handleSelect={handleSelect} category="type" />
          <hr className="border-gray-800 border-dashed" />
          <FilterRow label="Xếp hạng" items={FILTER_DATA.ratings} activeValue={filters.rating} handleSelect={handleSelect} category="rating" />
          <hr className="border-gray-800 border-dashed" />
          <FilterRow label="Thể loại" items={FILTER_DATA.genres} activeValue={filters.genre} handleSelect={handleSelect} category="genre" />
          <hr className="border-gray-800 border-dashed" />
          <FilterRow label="Năm sản xuất" items={FILTER_DATA.years} activeValue={filters.year} handleSelect={handleSelect} category="year" />
          <hr className="border-gray-800 border-dashed" />
          <FilterRow label="Sắp xếp" items={FILTER_DATA.sort} activeValue={filters.sort} handleSelect={handleSelect} category="sort" />
          <hr className="border-gray-800 border-dashed" />

          <div className="flex justify-end p-4 gap-2">
            <button className="bg-mainblue cursor-pointer hover:opacity-90 text-[14px] text-white py-2 px-6 rounded-full flex items-center gap-2 transition-colors">
              Lọc kết quả <i className="fa-solid fa-arrow-right"></i>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer border border-gray-600 text-white py-2 px-8 text-[14px] rounded-full hover:bg-gray-800 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </fieldset>
  );
}

export default Fieldset;