import { IProject } from "../apis/v1/models/project.model";
import { IUser } from "../apis/v1/models/user.model";
import { ResponseInvitationActions } from "../types/invitationResponse.type";
import { paramsStringify } from "./queryString";

export const getInvitationMailTemplate = (project: IProject, senderUser: IUser, receiverUser: IUser) => {
	const query = paramsStringify({
		projectId: project._id,
		projectName: project.projectName,
		receiverPicture: receiverUser.picture,
		receiverId: receiverUser._id,
		receiverName: receiverUser.displayName,
		senderName: senderUser.displayName,
		senderPicture: senderUser.picture,
	});

	return /*html*/ `
    <div
        style="
            max-width: 500px;
            margin: 0 auto;
            font-family: Arial, Helvetica, sans-serif;
            box-shadow: 0 0 32px #cccc;
            padding: 8px;
            border-radius: 8px;
            color: #202020
        ">

        <h1 style="text-align: center; color: #202020">
            Rubik
        </h1>
        <div style="text-align: center">
            <div style="margin-bottom: 32px;">
                <img src="${senderUser?.picture}" alt="" style='border-radius: 9999px; width: 60px; aspect-ratio: 1; margin: -20px 40px '>
                <span style="font-size: 24px; color:#cccc; height: 60px">+</span>
                <img src="${receiverUser?.picture}" alt="" style='border-radius: 9999px; width: 60px; aspect-ratio: 1; margin: -20px 40px'>
            </div>
            <p style="font-size: 18px">
                <b>${senderUser?.displayName}</b> has invited you to collabarate on the
                <b>${project?.projectName}</b>
            </p>
            <p>
                You can <i style="color: deepskyblue">accept or decline</i> this
                invitation.
            </p>

            <a
                href="http://localhost:9090/api/projects/invitation/detail${query}"
                role="button"
                style="
                    text-align: center;
                    padding: 8px 16px;
                    background-color: #111318;
                    border-radius: 4px;
                    color: #fff;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                ">
                View invitation
            </a>
          
          
            <hr style=" width: 100%; margin: 2rem 0; color: #cccc" />

            <div style="text-align: center">
                <h3 style="text-align: center; color: #202020">
                    Rubik
                </h3>
                <small>Copyright@${new Date().getFullYear()} - All rights reserved</small>
            </div>
        </div>
    </div>
		`;
};
