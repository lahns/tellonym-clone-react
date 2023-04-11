
import { ReactComponent as InstagramIcon } from "./icons/instagram.svg";
import { ReactComponent as TwitchIcon } from "./icons/twitch.svg";
import { ReactComponent as TwitterIcon } from "./icons/twitter.svg";
import { ReactComponent as YoutubeIcon } from "./icons/youtube.svg";

type BadgeProps = {
    label: string,
    link: string,
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
    onClick?: () => void,
    textColor: string,
};

const Badge = ({label, link, icon, onClick, textColor}: BadgeProps) => {

    const Icon = icon;

    return (
        <a onClick={onClick} href={link} className="flex flex-row gap-2 justify-center items-center">
            <Icon className="w-6 fill-gray-onBg"/>
            <a className={`${textColor} underline-offset-2 underline hidden md:block truncate`}>{label}</a>
        </a>
    );
}

type SubBadgeProps = {
    label: string,
    link: string,
}


Badge.Youtube = ({label, link}: SubBadgeProps) => <Badge
    label={label}
    link={link}
    icon={YoutubeIcon}
    textColor="text-[#ff0000]/40"
/>


Badge.Twitter = ({label, link}: SubBadgeProps) => <Badge
    label={label}
    link={link}
    icon={TwitterIcon}
    textColor="text-[#1da1f2]/40"
/>


Badge.Instagram = ({label, link}: SubBadgeProps) => <Badge
    label={label}
    link={link}
    icon={InstagramIcon}
    textColor="text-[#F56040]/40"
/>

    
Badge.Twitch = ({label, link}: SubBadgeProps) => <Badge
    label={label}
    link={link}
    icon={TwitchIcon}
    textColor="text-[#9146ff]/40"
/>

export default Badge;