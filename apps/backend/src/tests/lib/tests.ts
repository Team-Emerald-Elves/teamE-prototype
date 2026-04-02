type AssertionType = "Equals" | "NotEquals" | "True" | "False" | "NotEmpty"

class UnitTest<TInput = void, TOutput = unknown> {
  private callback: (arg: TInput) => TOutput | Promise<TOutput>
  private expected?: TOutput
  private assertionType?: AssertionType

  public result?: TOutput

  constructor(callback: (arg: TInput) => TOutput | Promise<TOutput>) {
    this.callback = callback
  }

  public setExpected(
    expected: TOutput,
    assertionType: AssertionType = "Equals"
  ): void {
    this.expected = expected
    this.assertionType = assertionType
  }

  private formatValue(value: unknown): string {
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }

  private hasStoredExpected(): boolean {
    return this.expected !== undefined
  }

  private async runCallback(input?: TInput): Promise<TOutput> {
    const value = await this.callback(input as TInput)
    this.result = value
    return value
  }

  private isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) {
      return true
    }

    if (typeof value === "string") {
      return value.length === 0
    }

    if (Array.isArray(value)) {
      return value.length === 0
    }

    if (typeof value === "object") {
      return Object.keys(value).length === 0
    }

    return false
  }

  public async assertEquals(expected: TOutput): Promise<void>
  public async assertEquals(input: TInput, expected: TOutput): Promise<void>
  public async assertEquals(...args: [TOutput] | [TInput, TOutput]): Promise<void> {
    let result: TOutput
    let finalExpected: TOutput

    if (args.length === 1) {
      result = await this.runCallback()
      finalExpected = args[0] as TOutput
    } else {
      result = await this.runCallback(args[0] as TInput)
      finalExpected = args[1] as TOutput
    }

    if (result !== finalExpected) {
      throw new Error(
        `Assertion failed: expected ${this.formatValue(finalExpected)}, but got ${this.formatValue(result)}`
      )
    }
  }

  public async assertNotEquals(expected: TOutput): Promise<void>
  public async assertNotEquals(input: TInput, expected: TOutput): Promise<void>
  public async assertNotEquals(...args: [TOutput] | [TInput, TOutput]): Promise<void> {
    let result: TOutput
    let finalExpected: TOutput

    if (args.length === 1) {
      result = await this.runCallback()
      finalExpected = args[0] as TOutput
    } else {
      result = await this.runCallback(args[0] as TInput)
      finalExpected = args[1] as TOutput
    }

    if (result === finalExpected) {
      throw new Error(
        `Assertion failed: did not expect ${this.formatValue(finalExpected)}, but got ${this.formatValue(result)}`
      )
    }
  }

  public async assertTrue(): Promise<void>
  public async assertTrue(input: TInput): Promise<void>
  public async assertTrue(...args: [] | [TInput]): Promise<void> {
    const result =
      args.length === 0
        ? await this.runCallback()
        : await this.runCallback(args[0])

    if (result !== true) {
      throw new Error(
        `Assertion failed: expected true, but got ${this.formatValue(result)}`
      )
    }
  }

  public async assertFalse(): Promise<void>
  public async assertFalse(input: TInput): Promise<void>
  public async assertFalse(...args: [] | [TInput]): Promise<void> {
    const result =
      args.length === 0
        ? await this.runCallback()
        : await this.runCallback(args[0])

    if (result !== false) {
      throw new Error(
        `Assertion failed: expected false, but got ${this.formatValue(result)}`
      )
    }
  }

  public async assertStoredEquals(): Promise<void>
  public async assertStoredEquals(input: TInput): Promise<void>
  public async assertStoredEquals(...args: [] | [TInput]): Promise<void> {
    if (!this.hasStoredExpected()) {
      throw new Error("Assertion failed: no expected value was provided")
    }

    const result =
      args.length === 0
        ? await this.runCallback()
        : await this.runCallback(args[0])

    if (result !== this.expected) {
      throw new Error(
        `Assertion failed: expected ${this.formatValue(this.expected)}, but got ${this.formatValue(result)}`
      )
    }
  }

  public async assertStoredNotEquals(): Promise<void>
  public async assertStoredNotEquals(input: TInput): Promise<void>
  public async assertStoredNotEquals(...args: [] | [TInput]): Promise<void> {
    if (!this.hasStoredExpected()) {
      throw new Error("Assertion failed: no expected value was provided")
    }

    const result =
      args.length === 0
        ? await this.runCallback()
        : await this.runCallback(args[0])

    if (result === this.expected) {
      throw new Error(
        `Assertion failed: did not expect ${this.formatValue(this.expected)}, but got ${this.formatValue(result)}`
      )
    }
  }

  public async assertNotEmpty(): Promise<void>
  public async assertNotEmpty(input: TInput): Promise<void>
  public async assertNotEmpty(...args: [] | [TInput]): Promise<void> {
    const result =
      args.length === 0
        ? await this.runCallback()
        : await this.runCallback(args[0])

    if (this.isEmpty(result)) {
      throw new Error(
        `Assertion failed: expected value to not be empty, but got ${this.formatValue(result)}`
      )
    }
  }
}

export default UnitTest