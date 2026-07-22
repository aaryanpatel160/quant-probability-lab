import { z } from 'zod'
import type { Difficulty, Module, Question, QuestionPhase, ResourceCitation } from '../types'

const SOURCES = {
  jane: {
    label: 'Jane Street — Probability & Markets',
    url: 'https://www.janestreet.com/static/pdfs/trading-interview.pdf',
    note: 'Concept reference. This question uses original wording and values.'
  },
  mit: {
    label: 'MIT OpenCourseWare 18.05',
    url: 'https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/',
    note: 'Concept reference. This question uses original wording and values.'
  },
  harvard: {
    label: 'Harvard Statistics 110',
    url: 'https://stat110.hsites.harvard.edu/',
    note: 'Concept reference. This question uses original wording and values.'
  },
  cards: {
    label: 'Jane Street — Probability Playing Cards',
    url: 'https://www.janestreet.com/probability-playing-cards/',
    note: 'Topic inspiration only. This is not presented as a reported interview question.'
  }
} satisfies Record<string, ResourceCitation>

export const modules: Module[] = [
  moduleDef('foundations', 1, 'Numerical foundations and odds', 'Foundations', 'Build intuition for probabilities, complements, odds and frequencies.', 'probability', 15, SOURCES.jane,
    ['Probability is a number from 0 to 1.', 'Odds a:b convert to probability a/(a+b).', 'Use complements when “not happening” is easier to count.'],
    ['A game wins with odds 3:2.', 'There are 3 winning shares out of 5 total shares.', 'The win probability is 3/5 = 60%.'], '3/5'),
  moduleDef('events', 2, 'Sample spaces and event rules', 'Events', 'Represent outcomes carefully and combine events without double-counting.', 'probability', 20, SOURCES.jane,
    ['List equally likely atomic outcomes.', 'P(A or B)=P(A)+P(B)-P(A and B).', 'P(not A)=1-P(A).'],
    ['Roll a fair die. Find P(even or at least 5).', 'Even outcomes are {2,4,6}; at least 5 gives {5,6}.', 'Their union is {2,4,5,6}, four of six outcomes.'], '2/3'),
  moduleDef('counting', 3, 'Counting and combinatorics', 'Counting', 'Use permutations, combinations and complementary counting.', 'probability', 25, SOURCES.mit,
    ['Order matters for permutations.', 'Order does not matter for combinations.', 'Count the same objects in two ways to check your work.'],
    ['Choose 2 people from a group of 5.', 'Order does not matter, so use C(5,2).', 'C(5,2)=5×4/(2×1)=10.'], '10'),
  moduleDef('conditional', 4, 'Conditional probability, independence and Bayes', 'Conditional & Bayes', 'Update probabilities when information arrives and distinguish dependence from independence.', 'probability', 30, SOURCES.mit,
    ['P(A|B)=P(A and B)/P(B).', 'Independent events satisfy P(A and B)=P(A)P(B).', 'Bayes compares how well competing explanations predict the evidence.'],
    ['A bag has 3 red and 2 blue balls. Draw two without replacement.', 'After a red, 2 red remain among 4 balls.', 'P(two red)=3/5×2/4=3/10.'], '3/10'),
  moduleDef('random-variables', 5, 'Random variables and discrete distributions', 'Random variables', 'Translate uncertain outcomes into numerical distributions.', 'probability', 25, SOURCES.harvard,
    ['A random variable assigns a number to each outcome.', 'Binomial counts successes in fixed independent trials.', 'Geometric counts trials until the first success.'],
    ['Flip a fair coin 4 times. Find P(exactly 2 heads).', 'Choose which 2 of 4 flips are heads: C(4,2).', 'Each sequence has probability 1/16, so the result is 6/16.'], '3/8'),
  moduleDef('expectation', 6, 'Expected value, linearity and indicators', 'Expected value', 'Price uncertain payoffs and simplify totals with linearity.', 'probability', 30, SOURCES.jane,
    ['E[X] is the probability-weighted average payoff.', 'E[X+Y]=E[X]+E[Y], even without independence.', 'An indicator has expectation equal to its event probability.'],
    ['A ticket pays £12 with probability 1/4 and £0 otherwise.', 'Multiply each payoff by its probability.', 'E[X]=12×1/4+0×3/4=£3.'], '£3'),
  moduleDef('variance', 7, 'Variance, covariance and risk', 'Risk', 'Measure dispersion and understand how dependence changes portfolio risk.', 'probability', 20, SOURCES.mit,
    ['Var(X)=E[(X-E[X])²].', 'Independent variances add.', 'Covariance measures whether variables move together.'],
    ['A fair coin pays 0 or 2.', 'The mean is 1; both outcomes are distance 1 from it.', 'Variance=(1²+1²)/2=1.'], '1'),
  moduleDef('continuous', 8, 'Continuous and geometric probability', 'Continuous probability', 'Move from counting outcomes to lengths, areas and densities, learning calculus as needed.', 'probability', 20, SOURCES.harvard,
    ['Probabilities are areas under a density.', 'For a uniform variable, probability is favourable length divided by total length.', 'An integral is accumulated area; the course introduces it before using it.'],
    ['X is uniform on [0,10]. Find P(X>7).', 'The favourable interval has length 3.', 'Divide by total length 10.'], '3/10'),
  moduleDef('processes', 9, 'Recursion, repeated games and stopping', 'Repeated games', 'Solve waiting-time, random-walk and stopping questions by defining states.', 'probability', 15, SOURCES.cards,
    ['Name the state before writing equations.', 'Condition on the next step to create a recurrence.', 'Check boundary states separately.'],
    ['A coin lands heads with probability 1/4. Expected flips to first head?', 'Each trial is an independent fresh start.', 'A geometric waiting time has mean 1/p=4.'], '4'),
  moduleDef('statistics', 10, 'Practical statistics and calibration', 'Statistics', 'Connect probability models to samples, estimates and uncertainty.', 'statistics', 25, SOURCES.mit,
    ['A statistic is computed from a sample.', 'Standard error shrinks like 1/√n.', 'Calibration asks whether x% forecasts happen about x% of the time.'],
    ['A sample mean uses values 3, 5, 7.', 'Add the values and divide by 3.', '(3+5+7)/3=5.'], '5'),
  moduleDef('markets', 11, 'Fair value, market making and adverse selection', 'Markets', 'Apply probability and EV to prices, spreads, inventory and informed flow.', 'markets', 25, SOURCES.jane,
    ['Fair value is an expected payoff, not a guaranteed payoff.', 'A market maker quotes a bid and an offer around fair value.', 'Order flow can reveal information: this is adverse selection.'],
    ['A contract pays £10 after heads and £2 after tails.', 'Both outcomes have probability 1/2.', 'Fair value=(10+2)/2=£6.'], '£6')
]

function moduleDef(
  id: string, order: number, title: string, shortTitle: string, description: string,
  category: Module['category'], questionCount: number, source: ResourceCitation,
  keyIdeas: string[], exampleSteps: string[], exampleAnswer: string
): Module {
  return {
    id, order, title, shortTitle, description, category, questionCount, source,
    lesson: {
      id: `${id}-lesson`, title: `Core ideas: ${shortTitle}`, summary: description, keyIdeas,
      workedExample: { prompt: exampleSteps[0], steps: exampleSteps.slice(1), answer: exampleAnswer }
    }
  }
}

const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b)
const factorial = (n: number) => Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1)
const choose = (n: number, r: number) => factorial(n) / (factorial(r) * factorial(n - r))
const permute = (n: number, r: number) => factorial(n) / factorial(n - r)
const fraction = (numerator: number, denominator: number) => {
  const d = gcd(numerator, denominator)
  return { kind: 'rational' as const, numerator: numerator / d, denominator: denominator / d }
}
const fracText = (n: number, d: number) => {
  const x = fraction(n, d)
  return x.denominator === 1 ? `${x.numerator}` : `${x.numerator}/${x.denominator}`
}
const money = (n: number) => `£${Number(n.toFixed(2))}`

function difficultyFor(index: number, count: number): Difficulty {
  return Math.min(5, Math.floor((index * 5) / count) + 1) as Difficulty
}

function phaseFor(index: number, count: number): QuestionPhase {
  if (index < Math.ceil(count * 0.25)) return 'guided'
  if (index === count - 1) return 'checkpoint'
  return 'independent'
}

type Draft = Omit<Question, 'id' | 'moduleId' | 'difficulty' | 'phase' | 'source'>

function finish(module: Module, index: number, draft: Draft): Question {
  const difficulty = difficultyFor(index, module.questionCount)
  return {
    ...draft,
    id: `${module.id}-${String(index + 1).padStart(3, '0')}`,
    moduleId: module.id,
    difficulty,
    phase: phaseFor(index, module.questionCount),
    source: module.source,
    solution: {
      ...draft.solution,
      followUp: difficulty >= 4
        ? (draft.solution.followUp ?? 'Change one assumption or parameter. Which parts of the method still work?')
        : undefined
    }
  }
}

function standardDraft(
  title: string, prompt: string, objective: string, tags: string[], answer: Draft['answer'],
  hint1: string, hint2: string, approach: string, steps: string[], finalAnswer: string, trap: string,
  hint3?: string
): Draft {
  return {
    title, prompt, objective, tags, answer,
    hints: [hint1, hint2, ...(hint3 ? [hint3] : [])].map((text, i) => ({ level: i + 1, text })),
    solution: { approach, steps, answer: finalAnswer, commonTrap: trap }
  }
}

function generateFoundations(m: Module, i: number): Question {
  const k = i + 1
  if (i % 3 === 0) {
    const win = 2 + (k % 7), lose = 1 + ((k * 2) % 6)
    const ans = fraction(win, win + lose)
    return finish(m, i, standardDraft(`Odds conversion ${k}`, `The odds in favour of a trade succeeding are ${win}:${lose}. What is the probability of success?`, 'Convert odds to probability.', ['odds', 'fractions'], ans, 'Odds compare winning shares with losing shares.', 'The total number of shares is the sum of both sides.', 'Divide winning shares by total shares.', [`Total shares=${win}+${lose}=${win + lose}.`, `Probability=${win}/${win + lose}=${fracText(win, win + lose)}.`], fracText(win, win + lose), 'Dividing by the losing side instead of the total.'))
  }
  if (i % 3 === 1) {
    const miss = 10 + (k % 7) * 5
    const hit = 100 - miss
    const answer: Draft['answer'] = i === 1
      ? { kind: 'multiple-choice', options: [`${hit}%`, `${miss}%`, `${100 + miss}%`, `${Math.abs(50 - miss)}%`], correctIndex: 0 }
      : { kind: 'numeric', value: hit, tolerance: 0.001, suffix: '%' }
    return finish(m, i, standardDraft(`Complement ${k}`, `A model misses an event ${miss}% of the time. What percentage of the time does it capture the event?`, 'Use a complement.', ['complements', 'percentages'], answer, 'Capture and miss are complementary events.', 'Their probabilities must add to 100%.', 'Subtract the miss percentage from 100%.', [`100%-${miss}%=${hit}%.`], `${hit}%`, 'Adding the percentages or converting 100% to 100 incorrectly.'))
  }
  const trials = 20 + (k % 5) * 20, numerator = 1 + (k % 4), denominator = 5
  const expected = trials * numerator / denominator
  return finish(m, i, standardDraft(`Expected frequency ${k}`, `An event has probability ${numerator}/${denominator} on each of ${trials} occasions. How many occurrences should you expect on average?`, 'Translate probability into expected frequency.', ['frequency', 'expectation'], { kind: 'numeric', value: expected, tolerance: 1e-9 }, 'Expected frequency is trials multiplied by probability.', 'This is a long-run average, not a guarantee.', 'Multiply n by p.', [`${trials}×${numerator}/${denominator}=${expected}.`], `${expected}`, 'Treating the expected count as a guaranteed count.'))
}

function generateEvents(m: Module, i: number): Question {
  const k = i + 1
  if (i % 3 === 0) {
    const sides = 6 + (k % 3) * 2, threshold = 2 + (k % (sides - 2))
    return finish(m, i, standardDraft(`Die event ${k}`, `A fair ${sides}-sided die is numbered 1 to ${sides}. What is P(roll ≥ ${threshold})?`, 'Count favourable outcomes in an equally likely sample space.', ['sample-space', 'dice'], fraction(sides - threshold + 1, sides), 'List the first and last favourable values.', 'Count inclusively.', 'Divide favourable outcomes by all outcomes.', [`Favourable values are ${threshold},…,${sides}: ${sides - threshold + 1} outcomes.`, `Probability=${fracText(sides - threshold + 1, sides)}.`], fracText(sides - threshold + 1, sides), 'Forgetting to include the threshold itself.'))
  }
  if (i % 3 === 1) {
    const flips = 2 + (k % 5)
    return finish(m, i, standardDraft(`At least one head ${k}`, `A fair coin is flipped ${flips} times. What is the probability of at least one head?`, 'Use complementary counting.', ['complement', 'coins'], fraction(2 ** flips - 1, 2 ** flips), 'The complement is no heads.', 'No heads means every flip is tails.', 'Subtract the all-tails probability from 1.', [`P(all tails)=(1/2)^${flips}=1/${2 ** flips}.`, `P(at least one head)=1-1/${2 ** flips}=${fracText(2 ** flips - 1, 2 ** flips)}.`], fracText(2 ** flips - 1, 2 ** flips), 'Adding the single-flip probabilities, which can exceed 1.'))
  }
  const n = 24 + (k % 4) * 6, a = 2 + (k % 3), b = a + 2
  const intersection = a * b / gcd(a, b)
  const count = Math.floor(n / a) + Math.floor(n / b) - Math.floor(n / intersection)
  return finish(m, i, standardDraft(`Union count ${k}`, `Choose an integer uniformly from 1 to ${n}. What is the probability it is divisible by ${a} or ${b}?`, 'Apply inclusion–exclusion.', ['union', 'inclusion-exclusion'], fraction(count, n), `Count multiples of ${a} and ${b} separately.`, 'Subtract numbers counted in both lists.', 'Common multiples are divisible by the least common multiple.', [`Multiples counts: ${Math.floor(n / a)} and ${Math.floor(n / b)}.`, `Common multiples: ${Math.floor(n / intersection)}.`, `Union count=${count}; probability=${fracText(count, n)}.`], fracText(count, n), 'Forgetting to subtract the intersection.'))
}

function generateCounting(m: Module, i: number): Question {
  const k = i + 1
  if (i % 4 === 0) {
    const n = 5 + (k % 4), r = 2 + (k % 3), value = permute(n, r)
    return finish(m, i, standardDraft(`Ordered roles ${k}`, `From ${n} candidates, how many ways can you choose an ordered president, deputy and further roles for ${r} distinct positions?`, 'Count ordered selections.', ['permutations'], { kind: 'numeric', value, tolerance: 0 }, 'The roles are distinct, so order matters.', 'There are fewer choices after each role is filled.', 'Use n!/(n-r)!.', [`P(${n},${r})=${n}!/(${n}-${r})!=${value}.`], `${value}`, 'Using a combination and losing the role order.'))
  }
  if (i % 4 === 1) {
    const n = 7 + (k % 5), r = 2 + (k % 4), value = choose(n, r)
    return finish(m, i, standardDraft(`Committee ${k}`, `How many unordered committees of ${r} can be chosen from ${n} people?`, 'Count unordered selections.', ['combinations'], { kind: 'numeric', value, tolerance: 0 }, 'Committee order does not matter.', 'Divide ordered selections by r!.', 'Use C(n,r).', [`C(${n},${r})=${n}!/(${r}!(${n - r})!)=${value}.`], `${value}`, 'Treating the same committee in different orders as different.'))
  }
  if (i % 4 === 2) {
    const length = 5 + (k % 5), ones = 1 + (k % Math.min(4, length - 1)), value = choose(length, ones)
    return finish(m, i, standardDraft(`Binary strings ${k}`, `How many binary strings of length ${length} contain exactly ${ones} ones?`, 'Map arrangements to combinations.', ['binary', 'combinations'], { kind: 'numeric', value, tolerance: 0 }, 'Choose the positions occupied by ones.', 'The remaining positions are forced to be zero.', 'Use C(length, ones).', [`Choose ${ones} positions from ${length}: C(${length},${ones})=${value}.`], `${value}`, 'Multiplying by arrangements of the zeros, which are indistinguishable.'))
  }
  const n = 4 + (k % 5), value = factorial(n)
  return finish(m, i, standardDraft(`Line-up ${k}`, `How many different line-ups are possible for ${n} distinct traders?`, 'Use the multiplication principle.', ['factorial', 'arrangements'], { kind: 'numeric', value, tolerance: 0 }, `There are ${n} choices for the first position.`, 'Each filled position leaves one fewer choice.', 'Multiply n×(n-1)×…×1.', [`${n}!=${value}.`], `${value}`, 'Using n² instead of a decreasing product.'))
}

function generateConditional(m: Module, i: number): Question {
  const k = i + 1
  if (i % 3 === 0) {
    const red = 3 + (k % 5), blue = 2 + ((k * 2) % 5), total = red + blue
    return finish(m, i, standardDraft(`Without replacement ${k}`, `A bag holds ${red} red and ${blue} blue tokens. Two are drawn without replacement. What is P(both are red)?`, 'Compute sequential conditional probabilities.', ['conditional', 'urn'], fraction(red * (red - 1), total * (total - 1)), 'Write the probability of red on the first draw.', 'Update both the red count and total after a red draw.', 'Multiply the two conditional probabilities.', [`P(R₁)=${red}/${total}.`, `P(R₂|R₁)=${red - 1}/${total - 1}.`, `Product=${fracText(red * (red - 1), total * (total - 1))}.`], fracText(red * (red - 1), total * (total - 1)), 'Treating the draws as independent.'))
  }
  if (i % 3 === 1) {
    const prevalence = 5 + (k % 4) * 5, sensitivity = 70 + (k % 3) * 10, falsePositive = 5 + (k % 3) * 5
    const numerator = prevalence / 100 * sensitivity / 100
    const denominator = numerator + (1 - prevalence / 100) * falsePositive / 100
    const posterior = numerator / denominator * 100
    return finish(m, i, standardDraft(`Bayes update ${k}`, `A signal occurs for ${prevalence}% of cases. A detector fires on ${sensitivity}% of signal cases and ${falsePositive}% of non-signal cases. Given a fire, what is P(signal), as a percentage?`, 'Apply Bayes using natural frequencies.', ['bayes', 'base-rates'], { kind: 'numeric', value: posterior, tolerance: 0.05, suffix: '%' }, 'Imagine 10,000 cases and count true and false fires.', 'The denominator is every way the detector can fire.', 'Posterior=true fires/(true fires+false fires).', [`True-fire share=${prevalence / 100}×${sensitivity / 100}=${numerator.toFixed(4)}.`, `False-fire share=${(1 - prevalence / 100).toFixed(2)}×${falsePositive / 100}=${((1 - prevalence / 100) * falsePositive / 100).toFixed(4)}.`, `Posterior=${posterior.toFixed(2)}%.`], `${posterior.toFixed(2)}%`, 'Ignoring the base rate and reporting sensitivity.'))
  }
  const sides = 6, threshold = 3 + (k % 3), target = threshold + (k % (sides - threshold + 1))
  return finish(m, i, standardDraft(`Conditional die ${k}`, `A fair d6 roll is known to be at least ${threshold}. What is P(roll=${target})?`, 'Restrict and renormalize a sample space.', ['conditional', 'dice'], fraction(1, sides - threshold + 1), `After conditioning, outcomes below ${threshold} are impossible.`, 'The remaining outcomes keep equal relative likelihood.', 'Count one target among the remaining values.', [`Remaining outcomes are {${Array.from({ length: sides - threshold + 1 }, (_, x) => x + threshold).join(', ')}}.`, `Probability=1/${sides - threshold + 1}.`], fracText(1, sides - threshold + 1), 'Keeping the original denominator of 6.'))
}

function generateRandomVariables(m: Module, i: number): Question {
  const k = i + 1
  if (i % 3 === 0) {
    const n = 4 + (k % 6), heads = 1 + (k % (n - 1)), numerator = choose(n, heads), denominator = 2 ** n
    return finish(m, i, standardDraft(`Binomial probability ${k}`, `A fair coin is flipped ${n} times. What is P(exactly ${heads} heads)?`, 'Use the binomial distribution.', ['binomial', 'coins'], fraction(numerator, denominator), 'Choose which flips are heads.', 'Every length-n sequence has probability 1/2ⁿ.', 'Multiply C(n,k) by 1/2ⁿ.', [`There are C(${n},${heads})=${numerator} qualifying sequences.`, `Probability=${numerator}/${denominator}=${fracText(numerator, denominator)}.`], fracText(numerator, denominator), 'Counting only one ordering of the heads.'))
  }
  if (i % 3 === 1) {
    const n = 5 + (k % 8), pNum = 1 + (k % 4), pDen = 5, value = n * pNum / pDen
    return finish(m, i, standardDraft(`Binomial mean ${k}`, `Let X count successes in ${n} independent trials with success probability ${pNum}/${pDen}. Find E[X].`, 'Use the binomial expectation.', ['binomial', 'expectation'], { kind: 'numeric', value, tolerance: 1e-9 }, 'Write X as a sum of success indicators.', 'Each indicator has mean p.', 'Use E[X]=np.', [`E[X]=${n}×${pNum}/${pDen}=${value}.`], `${value}`, 'Trying to enumerate the entire distribution.'))
  }
  const pDen = 3 + (k % 7), pNum = 1, value = pDen
  return finish(m, i, standardDraft(`Geometric wait ${k}`, `Independent trials succeed with probability ${pNum}/${pDen}. What is the expected number of trials until the first success, counting the successful trial?`, 'Recognize a geometric waiting time.', ['geometric', 'waiting-time'], { kind: 'numeric', value, tolerance: 1e-9 }, 'After every failure, the problem restarts.', 'For a geometric variable counting trials, the mean is 1/p.', 'Invert the success probability.', [`E[T]=1/(${pNum}/${pDen})=${value}.`], `${value}`, 'Using (1-p)/p, which counts failures rather than trials.'))
}

function generateExpectation(m: Module, i: number): Question {
  const k = i + 1
  if (i % 4 === 0) {
    const win = 8 + (k % 6) * 3, loss = 2 + (k % 5), pNum = 1 + (k % 3), pDen = 4
    const value = pNum / pDen * win - (1 - pNum / pDen) * loss
    return finish(m, i, standardDraft(`Gamble EV ${k}`, `A gamble wins ${money(win)} with probability ${pNum}/${pDen} and loses ${money(loss)} otherwise. What is its expected profit?`, 'Calculate a probability-weighted payoff.', ['ev', 'gamble'], { kind: 'numeric', value, tolerance: 0.011, suffix: '£' }, 'Treat a loss as a negative payoff.', 'Weight both outcomes by their probabilities.', 'Add the weighted payoffs.', [`EV=(${pNum}/${pDen})×${win}+(1-${pNum}/${pDen})×(-${loss}).`, `EV=${money(value)}.`], money(value), 'Adding the loss as a positive number.'))
  }
  if (i % 4 === 1) {
    const payout = 10 + (k % 8) * 5, pNum = 1 + (k % 4), pDen = 5, value = payout * pNum / pDen
    return finish(m, i, standardDraft(`Fair entry fee ${k}`, `A ticket pays ${money(payout)} with probability ${pNum}/${pDen} and zero otherwise. What is the fair entry fee?`, 'Set price equal to expected payout.', ['fair-value', 'ev'], { kind: 'numeric', value, tolerance: 0.011, suffix: '£' }, 'A fair fee makes expected net profit zero.', 'First calculate the expected payout.', 'The fair fee equals that expectation.', [`Expected payout=${payout}×${pNum}/${pDen}=${money(value)}.`], money(value), 'Multiplying the losing probability by the payout.'))
  }
  if (i % 4 === 2) {
    const items = 10 + (k % 8) * 5, pNum = 1 + (k % 3), pDen = 4, value = items * pNum / pDen
    return finish(m, i, standardDraft(`Indicator count ${k}`, `Among ${items} positions, each has probability ${pNum}/${pDen} of being profitable. Dependence between positions is unspecified. What is the expected number profitable?`, 'Apply linearity without requiring independence.', ['indicators', 'linearity'], { kind: 'numeric', value, tolerance: 1e-9 }, 'Create one indicator for each profitable position.', 'Each indicator has expectation equal to its probability.', 'Add expectations; independence is unnecessary.', [`E[count]=${items}×${pNum}/${pDen}=${value}.`], `${value}`, 'Assuming dependence prevents use of linearity.'))
  }
  const dice = 2 + (k % 6), sides = 4 + (k % 5), value = dice * (sides + 1) / 2
  return finish(m, i, standardDraft(`Sum of dice ${k}`, `Roll ${dice} independent fair ${sides}-sided dice. What is the expected sum?`, 'Use linearity on a sum.', ['linearity', 'dice'], { kind: 'numeric', value, tolerance: 1e-9 }, 'Find the mean of one die using symmetry.', 'The mean of 1,…,s is (s+1)/2.', 'Multiply by the number of dice.', [`E[one die]=(${sides}+1)/2=${(sides + 1) / 2}.`, `E[sum]=${dice}×${(sides + 1) / 2}=${value}.`], `${value}`, 'Trying to enumerate every possible total.'))
}

function generateVariance(m: Module, i: number): Question {
  const k = i + 1
  if (i % 3 === 0) {
    const pNum = 1 + (k % 4), pDen = 5, p = pNum / pDen, value = p * (1 - p)
    return finish(m, i, standardDraft(`Bernoulli variance ${k}`, `X equals 1 with probability ${pNum}/${pDen} and 0 otherwise. Find Var(X).`, 'Use Bernoulli variance.', ['variance', 'bernoulli'], { kind: 'numeric', value, tolerance: 1e-6 }, 'For a Bernoulli variable, E[X]=p and E[X²]=p.', 'Var(X)=E[X²]-E[X]².', 'Simplify to p(1-p).', [`Var(X)=(${pNum}/${pDen})(1-${pNum}/${pDen})=${value.toFixed(4)}.`], `${value.toFixed(4)}`, 'Reporting p as the variance.'))
  }
  if (i % 3 === 1) {
    const a = k % 5, b = a + 2 + (k % 6), value = (b - a) ** 2 / 4
    return finish(m, i, standardDraft(`Two-point risk ${k}`, `X is equally likely to be ${a} or ${b}. Find Var(X).`, 'Measure squared deviation from the mean.', ['variance', 'two-point'], { kind: 'numeric', value, tolerance: 1e-9 }, 'The mean is the midpoint.', 'Both outcomes are equally far from the midpoint.', 'Square that distance.', [`Mean=(${a}+${b})/2=${(a + b) / 2}.`, `Distance=${(b - a) / 2}; variance=distance²=${value}.`], `${value}`, 'Using the range instead of half the range.'))
  }
  const dice = 2 + (k % 5), sides = 4 + (k % 5), oneVar = (sides ** 2 - 1) / 12, value = dice * oneVar
  return finish(m, i, standardDraft(`Independent sum variance ${k}`, `Find the variance of the sum of ${dice} independent fair ${sides}-sided dice.`, 'Add variances of independent variables.', ['variance', 'independence'], { kind: 'numeric', value, tolerance: 1e-6 }, 'A fair 1,…,s die has variance (s²-1)/12.', 'Independence makes covariance terms zero.', 'Multiply one-die variance by the number of dice.', [`Var(one die)=(${sides}²-1)/12=${oneVar}.`, `Var(sum)=${dice}×${oneVar}=${value}.`], `${value}`, 'Adding standard deviations rather than variances.'))
}

function generateContinuous(m: Module, i: number): Question {
  const k = i + 1
  if (i % 3 === 0) {
    const max = 8 + (k % 7) * 2, threshold = 1 + (k % (max - 1))
    return finish(m, i, standardDraft(`Uniform tail ${k}`, `X is uniform on [0,${max}]. What is P(X>${threshold})?`, 'Use length ratios for a uniform variable.', ['uniform', 'continuous'], fraction(max - threshold, max), 'Draw the full interval and shade the favourable part.', 'Endpoint inclusion does not matter for a continuous variable.', 'Divide favourable length by total length.', [`Favourable length=${max}-${threshold}=${max - threshold}.`, `Probability=${fracText(max - threshold, max)}.`], fracText(max - threshold, max), 'Counting integer points in a continuous interval.'))
  }
  if (i % 3 === 1) {
    const a = k % 7, b = a + 4 + (k % 9), value = (a + b) / 2
    return finish(m, i, standardDraft(`Uniform mean ${k}`, `X is uniform on [${a},${b}]. Find E[X].`, 'Use symmetry of a uniform density.', ['uniform', 'expectation'], { kind: 'numeric', value, tolerance: 1e-9 }, 'The density is symmetric.', 'Its balance point is the interval midpoint.', 'Average the endpoints.', [`E[X]=(${a}+${b})/2=${value}.`], `${value}`, 'Using half the interval length without adding the lower endpoint.'))
  }
  const lambda = 0.1 * (1 + (k % 5)), time = 1 + (k % 6), value = Math.exp(-lambda * time)
  return finish(m, i, standardDraft(`Exponential tail ${k}`, `A waiting time T is exponential with rate ${lambda.toFixed(1)} per minute. Find P(T>${time}), rounded to four decimals.`, 'Use an exponential survival function.', ['exponential', 'calculus'], { kind: 'numeric', value, tolerance: 0.00011 }, 'The exponential tail is exp(-λt).', `Substitute λ=${lambda.toFixed(1)} and t=${time}.`, 'Evaluate the negative exponential.', [`P(T>${time})=e^{-(${lambda.toFixed(1)})(${time})}.`, `This is ${value.toFixed(4)}.`], value.toFixed(4), 'Using 1-e^{-λt}, which is P(T≤t).'))
}

function generateProcesses(m: Module, i: number): Question {
  const k = i + 1
  if (i % 3 === 0) {
    const pDen = 2 + (k % 8)
    return finish(m, i, standardDraft(`Wait for success ${k}`, `Each round succeeds independently with probability 1/${pDen}. What is the expected number of rounds to the first success?`, 'Solve a geometric recurrence.', ['recursion', 'geometric'], { kind: 'numeric', value: pDen, tolerance: 0 }, 'Let E be the expected remaining rounds.', `Write E=1+(1-1/${pDen})E.`, 'Solve the one-variable equation.', [`E=1+${pDen - 1}/${pDen}E.`, `E/${pDen}=1, so E=${pDen}.`], `${pDen}`, 'Forgetting that the successful round is counted.'))
  }
  if (i % 3 === 1) {
    const goal = 4 + (k % 7), start = 1 + (k % (goal - 1))
    return finish(m, i, standardDraft(`Fair random walk ${k}`, `A fair random walk starts at ${start} and moves ±1 each step. It stops at 0 or ${goal}. What is P(hit ${goal} first)?`, 'Use the fair gambler’s-ruin probability.', ['random-walk', 'stopping'], fraction(start, goal), 'For a fair walk, the current position is a martingale.', 'At stopping, the position is either 0 or the upper boundary.', 'Match the starting expectation to the stopping expectation.', [`${start}=0×P(hit 0)+${goal}×P(hit ${goal}).`, `Therefore P(hit ${goal})=${start}/${goal}=${fracText(start, goal)}.`], fracText(start, goal), 'Assuming the two boundaries are equally likely regardless of start.'))
  }
  const sides = 4 + (k % 9)
  return finish(m, i, standardDraft(`Wait for a face ${k}`, `Roll a fair ${sides}-sided die until a specified face appears. What is the expected number of rolls?`, 'Map a repeated experiment to a geometric wait.', ['waiting-time', 'dice'], { kind: 'numeric', value: sides, tolerance: 0 }, `Each roll succeeds with probability 1/${sides}.`, 'Previous failures do not change the next roll.', 'Invert the success probability.', [`E[T]=1/(1/${sides})=${sides}.`], `${sides}`, 'Subtracting one and reporting only expected failures.'))
}

function generateStatistics(m: Module, i: number): Question {
  const k = i + 1
  if (i % 5 === 0) {
    const center = 4 + (k % 10), values = [center - 2, center - 1, center, center + 1, center + 2]
    return finish(m, i, standardDraft(`Sample mean ${k}`, `Find the sample mean of ${values.join(', ')}.`, 'Compute a sample average.', ['mean', 'sample'], { kind: 'numeric', value: center, tolerance: 0 }, 'Add all observations.', 'There are five observations.', 'Divide the total by five.', [`The symmetric values sum to ${center * 5}.`, `Mean=${center * 5}/5=${center}.`], `${center}`, 'Dividing by n-1; that adjustment belongs to sample variance.'))
  }
  if (i % 5 === 1) {
    const sigma = 2 + (k % 7), nRoot = 2 + (k % 6), n = nRoot ** 2, value = sigma / nRoot
    return finish(m, i, standardDraft(`Standard error ${k}`, `A population has standard deviation ${sigma}. For a sample mean based on n=${n}, what is its standard error?`, 'Use the standard error of a mean.', ['standard-error', 'sampling'], { kind: 'numeric', value, tolerance: 1e-9 }, 'Standard error scales as σ/√n.', `√${n}=${nRoot}.`, 'Divide σ by √n.', [`SE=${sigma}/${nRoot}=${value}.`], `${value}`, 'Dividing by n instead of √n.'))
  }
  if (i % 5 === 2) {
    const se = 0.5 + (k % 6) * 0.25, value = 1.96 * se
    return finish(m, i, standardDraft(`Confidence margin ${k}`, `Using the normal approximation, a mean estimate has standard error ${se}. What is the 95% margin of error?`, 'Connect standard error to a normal interval.', ['confidence', 'normal'], { kind: 'numeric', value, tolerance: 0.011 }, 'A two-sided 95% normal interval uses 1.96 standard errors.', 'Margin means the distance from the estimate to either endpoint.', 'Multiply 1.96 by SE.', [`Margin=1.96×${se}=${value.toFixed(2)}.`], value.toFixed(2), 'Doubling the margin because the full interval has two sides.'))
  }
  if (i % 5 === 3) {
    const truth = 10 + (k % 10), estimate = truth + ((k % 5) - 2), value = estimate - truth
    return finish(m, i, standardDraft(`Estimator bias ${k}`, `An estimator has expected value ${estimate} when the true parameter is ${truth}. What is its bias?`, 'Apply the definition of bias.', ['bias', 'estimation'], { kind: 'numeric', value, tolerance: 0 }, 'Bias is expected estimate minus truth.', 'Keep the sign.', 'Subtract the parameter from the expected estimate.', [`Bias=${estimate}-${truth}=${value}.`], `${value}`, 'Taking an absolute value and losing the direction.'))
  }
  const forecasts = 20 + (k % 5) * 20, pct = 50 + (k % 5) * 10, value = forecasts * pct / 100
  return finish(m, i, standardDraft(`Calibration count ${k}`, `A calibrated forecaster makes ${forecasts} predictions at ${pct}%. About how many should occur on average?`, 'Interpret calibration as long-run frequency.', ['calibration', 'forecasting'], { kind: 'numeric', value, tolerance: 1e-9 }, 'A calibrated p% group succeeds p% of the time.', 'Convert the percentage to a decimal.', 'Multiply by the number of forecasts.', [`Expected count=${forecasts}×${pct}/100=${value}.`], `${value}`, 'Expecting every small batch to match the percentage exactly.'))
}

function generateMarkets(m: Module, i: number): Question {
  const k = i + 1
  if (i % 5 === 0) {
    const up = 10 + (k % 8) * 4, down = 2 + (k % 6), pNum = 1 + (k % 3), pDen = 4
    const value = pNum / pDen * up + (1 - pNum / pDen) * down
    return finish(m, i, standardDraft(`Contract fair value ${k}`, `A contract pays ${money(up)} with probability ${pNum}/${pDen} and ${money(down)} otherwise. What is its fair value?`, 'Price a contract by expected payoff.', ['fair-value', 'contract'], { kind: 'numeric', value, tolerance: 0.011, suffix: '£' }, 'List every payoff and probability.', 'Fair value is the weighted average payoff.', 'Multiply and add.', [`FV=(${pNum}/${pDen})×${up}+(1-${pNum}/${pDen})×${down}.`, `FV=${money(value)}.`], money(value), 'Pricing at the most likely payoff instead of the mean.'))
  }
  if (i % 5 === 1) {
    const fair = 20 + (k % 12), buy = fair - (1 + (k % 4)), quantity = 5 + (k % 5) * 5, value = (fair - buy) * quantity
    return finish(m, i, standardDraft(`Buying below fair ${k}`, `You estimate fair value at ${money(fair)} and buy ${quantity} units at ${money(buy)}. Ignoring fees, what is expected total profit?`, 'Translate an edge into expected P&L.', ['pnl', 'edge'], { kind: 'numeric', value, tolerance: 0.01, suffix: '£' }, 'Expected profit per unit is fair value minus purchase price.', 'Then multiply by size.', 'Keep price and quantity units separate.', [`Edge per unit=${fair}-${buy}=${money(fair - buy)}.`, `Total expected profit=${money(fair - buy)}×${quantity}=${money(value)}.`], money(value), 'Reporting the per-unit edge as total profit.'))
  }
  if (i % 5 === 2) {
    const bid = 90 + (k % 12), spread = 2 + (k % 6), offer = bid + spread, mid = (bid + offer) / 2
    return finish(m, i, standardDraft(`Quote midpoint ${k}`, `A market is quoted ${bid} bid / ${offer} offered. What are the midpoint and spread? Enter the midpoint.`, 'Read a two-sided quote.', ['spread', 'quote'], { kind: 'numeric', value: mid, tolerance: 0 }, 'Midpoint is the average of bid and offer.', `Spread is ${offer}-${bid}.`, 'Add then divide by two.', [`Midpoint=(${bid}+${offer})/2=${mid}.`, `Spread=${spread}.`], `${mid}`, 'Confusing the spread with half-spread.'))
  }
  if (i % 5 === 3) {
    const quantity = 10 + (k % 5) * 10, entry = 50 + (k % 10), move = (k % 2 === 0 ? 1 : -1) * (1 + (k % 4)), exit = entry + move, value = quantity * move
    return finish(m, i, standardDraft(`Inventory P&L ${k}`, `You are long ${quantity} units bought at ${money(entry)}. The mark moves to ${money(exit)}. What is the mark-to-market P&L?`, 'Calculate inventory exposure.', ['inventory', 'pnl'], { kind: 'numeric', value, tolerance: 0.01, suffix: '£' }, 'A long position gains when price rises.', 'P&L per unit is new price minus entry price.', 'Multiply by quantity and preserve the sign.', [`P&L=${quantity}×(${exit}-${entry})=${money(value)}.`], money(value), 'Using the absolute price move and losing the sign.'))
  }
  return finish(m, i, {
    title: `Adverse selection ${k}`,
    prompt: `You quote a contract around fair value. A counterparty repeatedly buys immediately before favourable public news and sells before unfavourable news. Explain how your quotes should respond and why.`,
    objective: 'Recognize information in order flow.',
    tags: ['adverse-selection', 'market-making'],
    answer: { kind: 'self-graded', rubric: ['Recognizes the flow may be informed.', 'Explains that conditional fair value changes after observing the trade.', 'Recommends widening, moving or reducing the quote/size rather than blindly maintaining it.'] },
    hints: [
      { level: 1, text: 'Ask whether the trade direction contains information.' },
      { level: 2, text: 'Condition fair value on the observed order flow.' },
      { level: 3, text: 'Consider both quote level and size as risk controls.' }
    ],
    solution: {
      approach: 'Treat the trade itself as evidence and update the distribution of value.',
      steps: ['The timing pattern suggests the counterparty has better information.', 'A buy raises the conditional expected value; a sell lowers it.', 'Move or widen quotes and reduce size until the expected spread compensates for the information disadvantage.'],
      answer: 'Update fair value in the trade direction and quote more cautiously; otherwise the counterparty systematically trades only when your stale quote is wrong.',
      commonTrap: 'Assuming every trade is uninformed and treating the spread as guaranteed profit.',
      followUp: 'What evidence would distinguish informed flow from an ordinary run of luck?'
    }
  })
}

const generators: Record<string, (module: Module, index: number) => Question> = {
  foundations: generateFoundations,
  events: generateEvents,
  counting: generateCounting,
  conditional: generateConditional,
  'random-variables': generateRandomVariables,
  expectation: generateExpectation,
  variance: generateVariance,
  continuous: generateContinuous,
  processes: generateProcesses,
  statistics: generateStatistics,
  markets: generateMarkets
}

export const questions: Question[] = modules.flatMap(module =>
  Array.from({ length: module.questionCount }, (_, index) => generators[module.id](module, index))
)

const citationSchema = z.object({ label: z.string().min(3), url: z.string().url(), note: z.string().min(12) })
const answerSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('multiple-choice'), options: z.array(z.string()).min(2), correctIndex: z.number().int().nonnegative() }),
  z.object({ kind: z.literal('rational'), numerator: z.number().finite(), denominator: z.number().finite().refine(value => value !== 0, 'Denominator cannot be zero') }),
  z.object({ kind: z.literal('numeric'), value: z.number().finite(), tolerance: z.number().nonnegative(), suffix: z.string().optional() }),
  z.object({ kind: z.literal('self-graded'), rubric: z.array(z.string().min(5)).min(2) })
])

export const questionSchema = z.object({
  id: z.string().regex(/^[a-z-]+-\d{3}$/), moduleId: z.string(), title: z.string().min(3), prompt: z.string().min(12),
  objective: z.string().min(8), tags: z.array(z.string()).min(1), difficulty: z.number().int().min(1).max(5),
  phase: z.enum(['guided', 'independent', 'checkpoint']), answer: answerSchema,
  hints: z.array(z.object({ level: z.number().int().positive(), text: z.string().min(4) })).min(2).max(3),
  solution: z.object({ approach: z.string().min(8), steps: z.array(z.string().min(5)).min(1), answer: z.string().min(1), commonTrap: z.string().min(8), followUp: z.string().optional() }),
  source: citationSchema
})

export function validateContent() {
  const ids = new Set<string>()
  for (const question of questions) {
    questionSchema.parse(question)
    if (ids.has(question.id)) throw new Error(`Duplicate question id: ${question.id}`)
    ids.add(question.id)
  }
  const categoryCounts = questions.reduce<Record<string, number>>((acc, q) => {
    const category = modules.find(m => m.id === q.moduleId)?.category ?? 'missing'
    acc[category] = (acc[category] ?? 0) + 1
    return acc
  }, {})
  if (questions.length !== 250) throw new Error(`Expected 250 questions, found ${questions.length}`)
  if (categoryCounts.probability !== 200 || categoryCounts.statistics !== 25 || categoryCounts.markets !== 25) {
    throw new Error(`Invalid category allocation: ${JSON.stringify(categoryCounts)}`)
  }
  for (const module of modules) {
    const count = questions.filter(q => q.moduleId === module.id).length
    if (count !== module.questionCount) throw new Error(`${module.id}: expected ${module.questionCount}, found ${count}`)
  }
  return { questionCount: questions.length, categoryCounts }
}

validateContent()

export const questionById = new Map(questions.map(question => [question.id, question]))
export const moduleById = new Map(modules.map(module => [module.id, module]))
