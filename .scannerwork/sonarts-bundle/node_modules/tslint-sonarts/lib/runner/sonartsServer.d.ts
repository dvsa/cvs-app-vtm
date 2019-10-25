import * as ts from "typescript";
import { FileCache } from "./languageService";
export declare const DEFAULT_TSCONFIG = "DEFAULT_TSCONFIG";
export declare class SonarTsServer {
    readonly fileCache: FileCache;
    readonly tsConfigCache: Map<string, string>;
    readonly servicesPerTsconfig: Map<string, ts.LanguageService>;
    start(port: number): void;
    private handleAnalysisRequest;
    private getTsConfig;
}
