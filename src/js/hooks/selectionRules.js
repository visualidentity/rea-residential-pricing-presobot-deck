import _ from "lodash";

export default {
	onChange({ sections, context }) {
		// Make adjustments you want to the sections
		// eg. turning slide visibility on/off, reordering etc.
		// Return sections after changes are done
		return sections;

		// If you wish to send notifications to the user on certain changes
		// made, you can may return an object of sections & messages. These
		// messages will appear as notifications when the user is sorting slides

		// return {
		// 	sections,
		// 	messages: ["message"]
		// };
	}
};
