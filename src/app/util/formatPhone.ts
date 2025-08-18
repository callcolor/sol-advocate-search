import { format } from "path";

const formatPhone = (number: number | string): string => {
    // Format example: (555) 555-1212 
    const str = number.toString()
    const areaCode = str.slice(0, 3);
    const prefix = str.slice(3, 6);
    const num = str.slice(6, 10);
    return `(${areaCode}) ${prefix} - ${num}`;
}

export default formatPhone;
