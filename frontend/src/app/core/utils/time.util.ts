// แปลงเวลาจากนาที -> ชั่วโมง
  export const formatDuration = (totalMinutes: number): string => {
  if (!totalMinutes) return '0m';
  
  const hours = Math.floor(totalMinutes / 60); // หารเอาส่วนที่เป็นชั่วโมง
  const minutes = totalMinutes % 60;           // หาเศษที่เหลือเป็นนาที

  // จัดรูปแบบข้อความ
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
}