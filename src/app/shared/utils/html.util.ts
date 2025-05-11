export class HtmlUtil {
    public static scrollToElement(element: Element): void {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    public static scrollToFirstInvalidElement(): void {
        const element = document.getElementsByClassName('ng-invalid').item(0);
        if (element)
            HtmlUtil.scrollToElement(element)
    }

}