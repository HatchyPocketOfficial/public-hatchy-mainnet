import { Icon } from "@iconify/react";
import Image from "next/image";
import { FriendModel, UserModel } from "../../types";
import { shortenHex } from "../../utils";
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import useAccountFriends from "../../hooks/Accounts/useAccountFriends";
import { displayError, displaySuccess } from "../../utils/ErrorMessage";
import { useAccount } from "../../contexts/AccountContext";
import { isOnline } from "../../utils/accounts";
import Router from "next/router";
import { ACCOUNTS_IMAGES_URL } from "../../constants";

interface UserCardProps {
	userCardInfo: UserModel | FriendModel,
	addFriend?: (userId: string) => void,
	isFriend?: boolean
}

export default function UserCard({ userCardInfo, addFriend, isFriend = false }: UserCardProps) {
	const { userInfo: accountUserInfo, updateFriendsInfo } = useAccount();
	const { blockFriend } = useAccountFriends(accountUserInfo?._id);
	// const [showOptions, setShowOptions] = useState(false);
	TimeAgo.addLocale(en)

	const addFriendHandler = () => {
		if (!isFriend && addFriend) addFriend(userCardInfo._id);
	}

	const goToUserPage = () => {
		Router.push(`/account/${userCardInfo._id}`)
	}

	const block = (friend_id: string) => {
		blockFriend(friend_id).then((res) => {
			if (res?.data.code == 200) {
				displaySuccess("User added to block list");
				updateFriendsInfo();
			} else {
				displayError(res?.data.message)
			}
		})
	}
	return (
		<div className="bg-white h-24 w-72 p-3 relative text-gray-dark2 ">
			<div className='flex justify-end w-full absolute top-1 right-1'>
				{isFriend ?
					<button className="relative hover:text-gray-600 transition-colors z-10" onClick={() => block(userCardInfo.userId)}>
						<Icon icon="bx:user-x" width={26} />
					</button>
					:
					<button onClick={addFriendHandler} className="relative hover:text-gray-600 transition-colors  z-10">
						<Icon icon={"ant-design:user-add-outlined"} width={26} />
					</button>
				}
			</div>
			<div className="flex flex-row space-x-4 items-center h-full">
				{/**Profile picture */}
				<div className="relative">
					{userCardInfo.avatar ?
						<button className="m-auto w-14 h-14 relative rounded-full overflow-hidden bg-purple-400 hover:scale-105 ease-in duration-100" onClick={goToUserPage}>
							<Image src={`${ACCOUNTS_IMAGES_URL}/${userCardInfo.avatar}`}
								alt="egg"
								objectFit='cover'
								layout='fill' />
						</button>
						:
						<button className="m-auto pixelate w-14 h-14 relative rounded-full bg-purple-400 hover:scale-105 ease-in duration-100" onClick={goToUserPage}>
							<Image src={"/static/egg.gif"} alt="egg" layout='fill' />
						</button>
					}
					{isFriend &&
						<div className={`w-4 h-4  rounded-full absolute bottom-0 right-0 
						${isOnline(new Date(userCardInfo.lastViewedAt)) ? 'bg-green-dark' : 'bg-gray-400'}`} />
					}
				</div>
				<div className="flex flex-col -space-y-0 w-full ">
					<span className="font-bold text-lg cursor-pointer hover:text-blue-400 transition-colors w-full h-full relative" onClick={goToUserPage}>{userCardInfo.username ? userCardInfo.username : 'HATCHY USER'}</span>
					<span className="text-sm">{shortenHex(userCardInfo.address)}</span>
					<span className="text-sm">{isFriend ? userCardInfo.userId : userCardInfo._id}</span>
					{isFriend &&
						<span className="font-bold text-gray-dark text-sm text-righ"><ReactTimeAgo date={new Date(userCardInfo.lastViewedAt)} locale="en-US" /></span>
					}
				</div>
			</div>
		</div >
	)
}
