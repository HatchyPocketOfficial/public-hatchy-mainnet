import { InputHTMLAttributes } from "react";
import Button from "./Button";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	/**callback for on change event, usualy a setState function */
	setFile: (value: any) => void
	setFileType: (value: any) => void
}

export default function InputFile({ setFile, setFileType, className, ...defaultProps }: InputProps) {
	const acceptTypes = ['png', 'jpg', 'fbx', 'obj'];
	const handleFileInput = (e: any) => {
		const file = e.target.files[0];
		const auxType = file.name.split('.');
		const fileType = auxType[auxType.length - 1];
		if (file && acceptTypes.includes(fileType)) {
			var reader = new FileReader();
			reader.onload = function (e) {

				// reader.result incluye al principio: "data:image/jpeg;base64,"
				if (reader && reader.result) {
					setFile(reader.result);
					setFileType(fileType);
				}
			};
			reader.readAsDataURL(file);
		}
		return;
	}
	return (
		<div className={`bg-white bg-opacity-25 border-2 border-dashed m-4 border-white px-2 py-5 w-full rounded-lg placeholder:text-gray 
			flex flex-col justify-center items-center overflow-hidden relative`} >
			<span className="text-xl">Drag & Drop your file here</span>
			<br />
			<span>or</span>
			<Button label="Choose a File" />
			<input type='file' id="inputFile" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
				onChange={handleFileInput} {...defaultProps} />
		</div>
	)
}