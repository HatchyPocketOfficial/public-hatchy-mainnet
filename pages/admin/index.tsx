import type { NextLayoutComponentType} from 'next'
import Image from 'next/image'
import { ReactElement, useEffect, useState } from 'react'
import Banner from '../../components/Banner'
import Button from '../../components/Button'
import InputPictureFile from '../../components/InputPictureFile'
import Select from '../../components/Select'
import { useAccount } from '../../contexts/AccountContext'
import { AdminContextProvider} from '../../contexts/AdminContext'
import useAdminFunctions from '../../hooks/admin/useAdminFunctions'
import { displayError, displaySuccess } from '../../utils/ErrorMessage'
import Input from '../../components/Input'
import TextArea from '../../components/TextArea'
import { Badge, Category } from '../../types'
import { Icon } from '@iconify/react'
const AdminPage: NextLayoutComponentType = () => {
	const { userInfo } = useAccount();
	// const { adminInfo, badgesList } = useAdmin();
	const { uploadAvatar, fetchBadgeList, fetchCategoryList, addCategory, updateAdminInfo } = useAdminFunctions(userInfo);

	// upload picture
	const [pictureData, setPictureData] = useState();
	const [pictureFilename, setPictureFilename] = useState();

	const [avatarName, setAvatarName] = useState('')
	const [avatarDes, setAvatarDes] = useState('')

	const [badgesList, setBadgesList] = useState<Badge[]>()
	const [optionsBadges, setOptionsBadges] = useState<string[]>([])
	const [valuesBadges, setValuesBadges] = useState<string[]>([])
	const [optionBadge, setOptionBadge] = useState('')

	const [categoryList, setCategoryList] = useState<Category[]>()
	const [optionsCategory, setOptionsCategory] = useState<string[]>([])
	const [valuesCategory, setValuesCategory] = useState<string[]>([])
	const [optionCategory, setOptionCategory] = useState('')

	const [categoryInput, setCategoryInput] = useState('')

	useEffect(() => {
		fetchBadgeList().then((res) => {
			if (res?.data.code == 200) {
				setBadgesList(res.data.data);
			} else {
				displayError(res?.data.message)
			}
		})

		fetchCategoryList().then((res) => {
			if (res?.data.code == 200) {
				setCategoryList(res.data.data);
			} else {
				displayError(res?.data.message)
			}
		})
	}, []);

	useEffect(() => {
		if (badgesList) {
			const badgeNames: any = badgesList?.map(({ name }) => name)
			const propertyNames: any = badgesList.map(({ propertyName }) => propertyName)
			setOptionsBadges(badgeNames)
			setValuesBadges(propertyNames)
			setOptionBadge(badgeNames[0])
		}
		if (categoryList) {
			const categoryNames: any = categoryList?.map(({ category }) => category)
			setOptionsCategory(categoryNames)
			setOptionCategory(categoryNames[0])
		}

	}, [badgesList, categoryList])

	const clearData = () => {
		setPictureFilename(undefined);
		setPictureData(undefined);
		setAvatarName('')
		setAvatarDes('')
	}
	const addNewCategory = () => {
		addCategory(categoryInput).then((res) => {
			if (res?.data.code == 200) displaySuccess('Category uploaded successfully');
			else displayError(res?.data.message)
		})
		updateAdminInfo();
		setCategoryInput('')
	}
	const uploadAvatarPicture = () => {

		if (pictureFilename && avatarName && avatarDes && userInfo) {
			const formdata = new FormData();
			formdata.append("image", pictureFilename, "avatar_picture.png");
			formdata.append("category", optionCategory)
			formdata.append("name", avatarName)
			formdata.append("description", avatarDes)
			formdata.append("badge", optionBadge)
			uploadAvatar(formdata).then((res) => {
				if (res?.data.code == 200) {
					displaySuccess('Avatar uploaded successfully');
				} else {
					displayError(res?.data.message)
				}
			})
			clearData();
		}
	}

	return (
		<div className="bg-dao bg-cover w-full h-full text-center pt-0 flex flex-col text-white px-10 justify-center">
			<Banner title='ADMIN' />
			<span className='font-bold text-2xl mb-10'>username: {userInfo?.username}</span>
			<div className='w-ful flex flex-row justify-center space-x-10'>
				<div className='w-1/3 flex flex-col mb-10 px-2'>
					<span className=' text-xl mb-5'>Upload picture</span>
					{pictureData != null ?
						<div className='flex flex-col space-y-3'>
							<div className="m-auto pixelate w-56 h-56 relative overflow-hidden border rounded-md">
								<Image src={pictureData} alt="egg" objectFit='contain' layout='fill' />
							</div>
							<Button label='Change' onClick={clearData} />
						</div>
						:
						<InputPictureFile setFilename={setPictureFilename} setPictureData={setPictureData} />
					}
				</div>
				<div className='w-1/3 flex flex-col space-y-4 px-2'>
					<div className='w-full flex flex-col my-3'>
						<span className='font-bold'>NAME:</span>
						<Input value={avatarName} onChange={setAvatarName} styleType='transparency' />
					</div>
					<div className=''>
						<span className='font-bold'>DESCRIPTION:</span>
						<TextArea value={avatarDes} onChange={(e) => setAvatarDes(e.target.value)} />
					</div>
				</div>
				<div className='w-1/3 flex flex-col space-y-4 px-2'>
					<div className='flex flex-col'>
						<span className='font-bold bg-white text-black'>CATEGORY:</span>
						<Select options={optionsCategory} value={optionCategory} onChange={(e) => setOptionCategory(e.target.value)} />
					</div>
					<div className='flex flex-col'>
						<span className='font-bold bg-white text-black'>BADGE:</span>
						<Select options={optionsBadges} values={valuesBadges} value={optionBadge} onChange={(e) => setOptionBadge(e.target.value)} />
					</div>

				</div>
			</div>
			<div className='pt-3'>
				<Button label='Upload' onClick={uploadAvatarPicture} color='green' />
			</div>
			<div className='w-full flex justify-center items-center space-x-0 h-7 my-4'>
				<span className='font-bold'></span>
				<Input value={categoryInput} className='h-full' onChange={setCategoryInput} styleType='transparency' placeholder='Add a Category' />
				<button onClick={addNewCategory} className='bg-white bg-opacity-25 h-full ' >
					<Icon icon="akar-icons:send" width={26} />
				</button>
			</div>
			{/* <div className='flex flex-col overflow-y-auto mt-10'>
				Avatars here
			</div> */}
		</div>
	)
}

AdminPage.getLayout = function getLayout(page: ReactElement) {
	return (
		<AdminContextProvider>
			{page}
		</AdminContextProvider>
	);
};

export default AdminPage

