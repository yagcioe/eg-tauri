import { Result } from "../../../specta-bindings/specta-bindings";

export class SpectaUtil {
    public static mapResult<TResultBefore, TResultAfter, TErr>(result: Result<TResultBefore, TErr>, fn: (before: TResultBefore) => TResultAfter): Result<TResultAfter, TErr> {
        return result.status === "error" ? { status: "error", error: result.error } : { status: 'ok', data: fn(result.data) }
    }
}