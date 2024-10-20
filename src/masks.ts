import * as ipLib from 'ip';

// Функция для вычисления минимальной маски подсети для группы IP-адресов
const calculateSubnet = (ips: string[]): string => {
    if (ips.length === 1) {
        // Если только один IP, то возвращаем его с маской /32
        return `${ips[0]}/32`;
    }

    let subnet = ips[0];
    let mask = 32;

    for (let i = 1; i < ips.length; i++) {
        while (!ipLib.cidrSubnet(`${subnet}/${mask}`).contains(ips[i])) {
            mask--;
        }
    }

    return `${subnet}/${mask}`;
};

// Функция для группировки IP-адресов по подсетям
export const groupIpsBySubnet = async (pathToIps: string): Promise<string[]> => {

    // Чтение файла с IP адресами
    // const fileContent = fs.readFileSync(pathToIps, 'utf-8');
    const fileContent = await Bun.file(pathToIps).text()

    // Разделяем IP-адреса по строкам
    const ips = fileContent.split('\n').map(line => line.trim()).filter(line => line);
    const subnets: string[] = [];
    const usedIps: Set<string> = new Set();

    ips.forEach(ip => {
        if (!usedIps.has(ip)) {
            const ipsInSubnet = ips.filter(otherIp => ipLib.cidrSubnet(`${ip}/24`).contains(otherIp));
            ipsInSubnet.forEach(usedIp => usedIps.add(usedIp));

            // Вычисляем минимальную маску для текущей группы IP
            const subnet = calculateSubnet(ipsInSubnet);
            subnets.push(subnet);
        }
    });
    console.log(`Группировка и вычисление подсетей для ${pathToIps} завершены`);


    return subnets;
};


