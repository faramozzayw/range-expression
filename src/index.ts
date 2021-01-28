/** @hidden */
const isEmptyString = (str: string) => str.trim() === "";

/**
 * @class RangeExpr
 *
 * The range `start..end` contains all values with `start <= x < end`. It is empty if `start >= end`.
 */
export class RangeExpr {
	#start: number;
	#end: number;
	#inclusive: boolean;

	/**
	 * @param start The lower bound of the range (inclusive).
	 * @param end The upper bound of the range (inclusive, if the param `inclusive` is `true`, otherwise - exclusive).
	 * @param inclusive Determines whether the end will be included in the range, default to `false`
	 *
	 * @throws Will throw RangeError if one of the bounds is NaN.
	 */
	constructor(start: number, end: number, inclusive: boolean = false) {
		if (Number.isNaN(start) || Number.isNaN(end)) {
			throw new RangeError(`"NaN" does not include in range of correct values`);
		}

		const _end = Math.round(end);

		this.#start = Math.round(start);
		this.#end = inclusive ? _end + 1 : _end;
		this.#inclusive = inclusive;
	}

	static fromString(rangeString: string): RangeExpr {
		const regExp = /(\d+)?\.\.(=?)(\d+)?/;
		const [_, rawStart, rawInclusive, rawEnd] = rangeString
			.match(regExp)
			.map((item) => (typeof item === "undefined" ? "" : item));

		const start = isEmptyString(rawStart) ? -Infinity : Number(rawStart);
		const end = isEmptyString(rawEnd) ? Infinity : Number(rawEnd);

		const inclusive = rawInclusive === "=";

		return new RangeExpr(start, end, inclusive);
	}

	get start() {
		return this.#start;
	}

	get end() {
		return this.#end;
	}

	/**
	 * Returns the bounds of a Range
	 */
	getBounds(): [start: number, end: number] {
		return [this.#start, this.#end];
	}

	/**
	 * Returns `true` if the `Range` includes the end.
	 */
	isInclusive = (): boolean => this.#inclusive;

	#startIsExhaustive = () => Number.isFinite(this.#start);
	#endIsExhaustive = () => Number.isFinite(this.#end);

	isExhaustive(): boolean {
		if (this.#endIsExhaustive() && this.#startIsExhaustive()) {
			return true;
		}

		return false;
	}

	/**
	 * Returns `true` if `item` is contained in the range.
	 *
	 * @param item The searched value
	 */
	contains(item: number): boolean {
		if (Number.isNaN(item)) {
			console.warn("Incorrect value");
			return false;
		}

		if (this.#inclusive) {
			return this.#start <= item && item <= this.#end;
		} else {
			return this.#start <= item && item < this.#end;
		}
	}

	/**
	 * Returns `true` if the range contains no items.
	 */
	isEmpty(): boolean {
		return !(this.#start < this.#end);
	}

	/**
	 * The RangeExpr.clone() method returns a RangeExpr object with boundary points identical to the cloned RangeExpr.
	 *
	 * The returned clone is copied by **value, not reference,** so a change in either RangeExpr does not affect the other.
	 */
	clone(): RangeExpr {
		return new RangeExpr(this.#start, this.#end);
	}

	*[Symbol.iterator]() {
		const { start, end } = this;

		for (let i = start; i < end; i++) {
			yield i;
		}
	}

	get [Symbol.toStringTag]() {
		return "RangeExpr";
	}

	/**
	 * @override
	 */
	toString() {
		const start =
			this.#startIsExhaustive() && Number.isFinite(this.#start)
				? this.#start
				: "";
		const end =
			this.#endIsExhaustive() && Number.isFinite(this.#end)
				? this.#inclusive
					? this.#end - 1
					: this.#end
				: "";
		const inclusive = this.#inclusive ? "=" : "";

		return `${start}..${inclusive}${end}`;
	}
}

export class RangeFromExpr extends RangeExpr {
	constructor(start: number) {
		super(start, Infinity);
	}

	[Symbol.iterator]: null = null;
}

export class RangeToExpr extends RangeExpr {
	constructor(end: number) {
		super(-Infinity, end);
	}

	[Symbol.iterator]: null = null;
}

export class RangeInclusiveExpr extends RangeExpr {
	constructor(start: number, end: number) {
		super(start, end, true);
	}
}

export class RangeToInclusiveExpr extends RangeExpr {
	constructor(end: number) {
		super(-Infinity, end, true);
	}

	[Symbol.iterator]: null = null;
}

export class RangeFullExpr extends RangeExpr {
	constructor() {
		super(-Infinity, Infinity);
	}

	[Symbol.iterator]: null = null;
}
