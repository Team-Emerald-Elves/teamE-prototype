export type DateAndTimeProps = {
    id?: string;
    date?: Date;
    time?: string;
    setDate: (date: Date | undefined) => void;
    setTime: (time: string) => void;
    disableTime?: boolean;
};
