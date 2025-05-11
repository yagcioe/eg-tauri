import moment from "moment";

export class DateParser {
    public static stringToHHmm(duration: string): string {
        return this.durationToHHmm(moment.duration(duration));
    }

    public static durationToHHmm(duration: moment.Duration): string {
        return this.toFormat(duration, "HH:mm")
    }

    public static stringToHHmmss(duration: string): string {
        return this.durationToHHmmss(moment.duration(duration))
    }

    public static durationToHHmmss(duration: moment.Duration): string {
        return this.toFormat(duration, "HH:mm:ss");
    }

    private static toFormat(duration: moment.Duration, format: string): string {
        return moment.utc(duration.asMilliseconds()).format(format)
    }
}