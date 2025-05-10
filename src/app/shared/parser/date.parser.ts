import moment from "moment";

export class DateParser {
    public static stringToHHmm(duration: string): string {
        return this.durationToHHmm(moment.duration(duration));
    }

    public static durationToHHmm(duration: moment.Duration): string {
        return moment.utc(duration.asMilliseconds()).format("HH:mm")
    }

    public static toHHmmss(duration: string): string {
        return moment.utc(moment.duration(duration).asMilliseconds()).format("HH:mm:ss")
    }
}