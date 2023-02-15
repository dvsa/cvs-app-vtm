/**
 * Used for all vehicles types - PSV, HGV and TRL. x = other, d = double decker. Used only for HGV and TRL. p = petrol/oil tanker, o = other tanker, s = skip loader, f = flat, c = refrigerated, b = box, e = curtainsider, k = skeletal, t = tipper, y = car transporter, i = livestock carrier. Used only for HGV. r = refuse, m = concrete mixer, a = fast trac tractor, u = artic unit. Used only for PSV. s = single decker, a = articulated, m = mini bus. Used only for TRL. l = low loader.
 */
export interface TechRecordBodyType { 
    code?: TechRecordBodyType.CodeEnum;
    description?: TechRecordBodyType.DescriptionEnum;
}
export namespace TechRecordBodyType {
    export type CodeEnum = 'a' | 's' | 'd' | 'o' | 'x' | 'p' | 'k' | 't' | 'b' | 'f' | 'r' | 'c' | 'e' | 'y' | 'm' | 'i' | 'u' | 'l';
    export const CodeEnum = {
        A: 'a' as CodeEnum,
        S: 's' as CodeEnum,
        D: 'd' as CodeEnum,
        O: 'o' as CodeEnum,
        M: 'm' as CodeEnum,
        X: 'x' as CodeEnum,
        P: 'p' as CodeEnum,
        K: 'k' as CodeEnum,
        T: 't' as CodeEnum,
        B: 'b' as CodeEnum,
        F: 'f' as CodeEnum,
        R: 'r' as CodeEnum,
        C: 'c' as CodeEnum,
        E: 'e' as CodeEnum,
        Y: 'y' as CodeEnum,
        M_15: 'm' as CodeEnum,
        I: 'i' as CodeEnum,
        A_17: 'a' as CodeEnum,
        U: 'u' as CodeEnum,
        L: 'l' as CodeEnum
    };
    export type DescriptionEnum = 'articulated' | 'single decker' | 'double decker' | 'other' | 'other tanker' | 'petrol/oil tanker' | 'skeletal' | 'tipper' | 'box' | 'flat' | 'refuse' | 'skip loader' | 'refrigerated' | 'curtainsider' | 'car transporter' | 'concrete mixer' | 'mini bus' | 'livestock carrier' | 'fast trac tractor' | 'artic unit' | 'low loader';
    export const DescriptionEnum = {
        Articulated: 'articulated' as DescriptionEnum,
        SingleDecker: 'single decker' as DescriptionEnum,
        DoubleDecker: 'double decker' as DescriptionEnum,
        Other: 'other' as DescriptionEnum,
        OtherTanker: 'other tanker' as DescriptionEnum,
        PetroloilTanker: 'petrol/oil tanker' as DescriptionEnum,
        Skeletal: 'skeletal' as DescriptionEnum,
        Tipper: 'tipper' as DescriptionEnum,
        Box: 'box' as DescriptionEnum,
        Flat: 'flat' as DescriptionEnum,
        Refuse: 'refuse' as DescriptionEnum,
        SkipLoader: 'skip loader' as DescriptionEnum,
        Refrigerated: 'refrigerated' as DescriptionEnum,
        Curtainsider: 'curtainsider' as DescriptionEnum,
        CarTransporter: 'car transporter' as DescriptionEnum,
        ConcreteMixer: 'concrete mixer' as DescriptionEnum,
        MiniBus: 'mini bus' as DescriptionEnum,
        LivestockCarrier: 'livestock carrier' as DescriptionEnum,
        FastTracTractor: 'fast trac tractor' as DescriptionEnum,
        ArticUnit: 'artic unit' as DescriptionEnum,
        LowLoader: 'low loader' as DescriptionEnum
    };
}