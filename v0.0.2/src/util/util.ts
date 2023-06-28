


export class Util{

    average = async (array:number[]):Promise<number|null> => {

        const days = array.filter((value) => value !== null);
        const sum = days.reduce((acc, value) => acc + value, 0);
        const avg = Math.round(sum / days.length) || null;
        return await avg;
    }
}