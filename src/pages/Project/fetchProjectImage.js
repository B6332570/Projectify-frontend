import axios from 'axios';

const UNSPLASH_ACCESS_KEY = 'YrpEjoSH9UHQnw57cnEeNv_kmJZMVP9MR0-VZlny29o';

const fetchProjectImage = async () => {
  try {
    const response = await axios.get('https://api.unsplash.com/photos/random', {
      params: {
        query: 'office',
        client_id: UNSPLASH_ACCESS_KEY,
      },
    });

    const imageUrl = response.data.urls.raw;
    // เพิ่มพารามิเตอร์ `fit`, `w`, และ `h`
    const resizedImageUrl = `${imageUrl}&fit=crop&w=400&h=300`;
    localStorage.setItem('cachedProjectImage', resizedImageUrl);
    return resizedImageUrl;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.warn('Rate limit exceeded, using cached image');
      const cachedImage = localStorage.getItem('cachedProjectImage');
      if (cachedImage) {
        return cachedImage;
      }
    }
    console.error('Error fetching image:', error);
    return 'https://via.placeholder.com/400x300'; // รูปภาพสำรองในกรณีที่ไม่สามารถดึงรูปภาพจาก Unsplash ได้
  }
};

export default fetchProjectImage;
