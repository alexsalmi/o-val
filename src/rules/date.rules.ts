import Rule from "classes/rule.class.js";
import StringRules from "./string.rules.js";

const DateRules: RuleSet = {
	// Checks that the value passed is a date
	date: new Rule('date',
		function (): Function {
			return (value: string): boolean => {
				let date = new Date(value);
        return date.toString() !== 'Invalid Date';
			}
		},
		`'{key}' must be a valid date'`
	),

	// Checks if the date is before a set date
	before: new Rule('before',
		function (date: string): Function {
			const setDate = new Date(date);
			return (value: string): boolean => {
				const inputDate = new Date(value);
				return inputDate < setDate;
			}
		},
		`'{key}' must be a date before {arg0}'`
	),

	// Checks if the date is after a set date
	after: new Rule('after',
		function (date: string): Function {
			const setDate = new Date(date);
			return (value: string): boolean => {
				const inputDate = new Date(value);
				return inputDate > setDate;
			}
		},
		`'{key}' must be a date after {arg0}'`
	),

	// Checks if the date is between two set dates
	between: new Rule('between',
		function (date1: string, date2: string): Function {
			const setDate1 = new Date(date1);
			const setDate2 = new Date(date2);

			return (value: string): boolean => {
				const inputDate = new Date(value);
				return setDate1 < inputDate && inputDate < setDate2;
			}
		},
		`'{key}' must be a date between {arg0} and {arg1}'`
	),

	// Checks if the date is on a set date
	exactDate: new Rule('exactDate',
		function (date: string): Function {
			const setDate = new Date(date);

			return (value: string): boolean => {
				const inputDate = new Date(value);
				return setDate.getTime() === inputDate.getTime();
			}
		},
		`'{key}' must be {arg0}'`
	),

	// Checks if the date is in a set year
	inYear: new Rule('inYear',
		function (year: number): Function {
			return (value: string): boolean => {
				const inputDate = new Date(value);
				return inputDate.getFullYear() === Number(year);
			}
		},
		`'{key}' must be in the year {arg0}'`
	),

	// Checks if the date is in a set month
	inMonth: new Rule('inMonth',
		function (month: number): Function {
			return (value: string): boolean => {
				const inputDate = new Date(value);
				return (inputDate.getMonth()+1) === Number(month);
			}
		},
		`'{key}' must be in the month {arg0}'`
	)
}

DateRules.__proto__ = StringRules;

export default DateRules;