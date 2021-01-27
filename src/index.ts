/**
 * @class RangeExpr
 *
 * The range `start..end` contains all values with `start <= x < end`. It is empty if `start >= end`.
 */
export class RangeExpr {
	private start: number;
	private end: number;
	private inclusive: boolean;

	/**
	 * @param start The lower bound of the range (inclusive).
	 * @param end The upper bound of the range (exclusive).
	 * @param inclusive
	 */
	constructor(start: number, end: number, inclusive: boolean = false) {
		const _end = Math.round(end);

		this.start = Math.round(start);
		this.end = inclusive ? _end + 1 : _end;
		this.inclusive = inclusive;
	}

	public getStart = () => this.start;
	public getEnd = () => this.end;

	public getBounds(): [start: number, end: number] {
		return [this.start, this.end];
	}

	/**
	 * Returns `true` if `item` is contained in the range.
	 */
	public contains(item: number): boolean {
		if (!Number.isSafeInteger(item)) {
			console.warn("Incorrect value");
			return false;
		}

		if (this.inclusive) {
			return this.start <= item && item <= this.end;
		} else {
			return this.start <= item && item < this.end;
		}
	}

	/**
	 * Returns `true` if the range contains no items.
	 */
	public isEmpty(): boolean {
		return !(this.start < this.end);
	}

	/**
	 * The RangeExpr.clone() method returns a RangeExpr object with boundary points identical to the cloned RangeExpr.
	 *
	 * The returned clone is copied by **value, not reference,** so a change in either RangeExpr does not affect the other.
	 */
	public clone(): RangeExpr {
		return new RangeExpr(this.start, this.end);
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
		const start = Number.isFinite(this.start) ? this.start : "";
		const end = Number.isFinite(this.end)
			? this.inclusive
				? this.end - 1
				: this.end
			: "";
		const inclusive = this.inclusive ? "=" : "";

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
