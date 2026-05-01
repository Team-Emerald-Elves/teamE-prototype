export type DateAndTimeProps = {
    id: string;
    date: Date;
    disableTime?: boolean;
    onDateChange: (date: Date) => void;
};
