type ParamObject = {
	[key: string]: any;
};
export const paramsStringify = (paramsObj: ParamObject) => {
	if (!paramsObj) return "";
	return (
		"?" +
		Object.keys(paramsObj)
			.map((key) => key + "=" + encodeURIComponent(paramsObj[key]))
			.join("&")
	);
};
