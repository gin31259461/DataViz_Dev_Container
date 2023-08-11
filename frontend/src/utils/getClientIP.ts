import axios from 'axios';

interface IpData {
  ip: string;
}

export async function getClientIp(): Promise<IpData | undefined> {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return (await response.data) as IpData;
  } catch (error) {
    console.error(error);
  }
}
