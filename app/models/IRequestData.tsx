interface IRequestData{
    sort: string,
    filters: {
        type: string;
        rating: string;
        status: string;
        
    },
    numberPage : number,
    setNumberPage: (num: number) => void;
}