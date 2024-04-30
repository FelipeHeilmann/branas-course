export default interface FareCalculator {
    FARE: number
    calculate(distance: number): number
}

export class NormalFareCalculator implements FareCalculator {
    FARE = 2.1;

    calculate(distance: number): number {
        return distance * this.FARE;
    }
}

export class OvernightFareCalculator implements FareCalculator {
    FARE = 4.2;

    calculate(distance: number): number {
        return distance * this.FARE;
    }
}

export class FareCalculatorFactory {
    static create(date: Date) {
        if(date.getHours() < 22) return new NormalFareCalculator();
        if(date.getHours() >= 22) return new OvernightFareCalculator();
        throw new Error();
    }
}