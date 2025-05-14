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

    public static stringToTime(duration: string): moment.Moment {
        return this.durationToDate(moment.duration(duration));
    }

    public static durationToDate(duration: moment.Duration): moment.Moment {
        return moment.utc(duration.asMilliseconds());
    }

    private static toFormat(duration: moment.Duration, format: string): string {
        return this.durationToDate(duration).format(format)
    }

}