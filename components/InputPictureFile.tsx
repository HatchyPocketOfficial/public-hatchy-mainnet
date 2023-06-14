import { InputHTMLAttributes } from "react";
import Button from "./Button";

interface InputPictureFileProps extends InputHTMLAttributes<HTMLInputElement> {
	/**callback for on change event, usualy a setState function */
	setFilename: (value: any) => void
	setPictureData: (value: any) => void
	setFileType?: (value: any) => void
}

export default function InputPictureFile({ setFilename, setPictureData, setFileType, className, ...defaultProps }: InputPictureFileProps) {
	const acceptTypes = ['png', 'jpg'];
	const handleFileInput = (e: any) => {
		const file = e.target.files[0];
		const auxType = file.name.split('.');
		const fileType = auxType[auxType.length - 1];
		if (file && acceptTypes.includes(fileType)) {
			setFilename(file);
			var reader = new FileReader();
			reader.onload = function (e) {
				// reader.result incluye al principio: "data:image/jpeg;base64,"
				if (reader && reader.result) {
					setPictureData(reader.result);
				}
			};
			reader.readAsDataURL(file);
		}
		return;
	}

	return (
		<div className={`bg-white bg-opacity-25 border-2 border-dashed  border-white px-2 py-5 w-full rounded-lg placeholder:text-gray 
			flex flex-col justify-center items-center overflow-hidden relative`} >
			<span className="text-lg text-center">Drag & Drop your file here <br /> (png, jpg)</span>
			<br />
			<span>or</span>
			<Button label="Choose an Image" />
			<input type='file' id="inputFile" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
				onChange={handleFileInput} {...defaultProps} />
		</div>
	)
}