package object

import (
	"strconv"

	"github.com/astaxie/beego"
	"github.com/casbin/casnode/auth"
)

var CasdoorOrganization = beego.AppConfig.String("casdoorOrganization")

func CreateCasdoorUserFromMember(member *Member) *auth.User {
	if member == nil {
		return nil
	}

	properties := map[string]string{}
	properties["tagline"] = member.Tagline
	properties["bio"] = member.Bio
	properties["website"] = member.Website
	properties["location"] = member.Location
	properties["checkinDate"] = member.CheckinDate
	properties["emailVerifiedTime"] = member.EmailVerifiedTime
	properties["phoneVerifiedTime"] = member.PhoneVerifiedTime
	properties["oauth_QQ_displayName"] = member.QQAccount
	properties["oauth_QQ_verifiedTime"] = member.QQVerifiedTime
	properties["fileQuota"] = strconv.Itoa(member.FileQuota)
	properties["oauth_WeChat_displayName"] = member.WechatAccount
	properties["oauth_WeChat_verifiedTime"] = member.WechatVerifiedTime
	properties["editorType"] = member.EditorType
	properties["renameQuota"] = strconv.Itoa(member.RenameQuota)

	user := &auth.User{
		Owner:         CasdoorOrganization,
		Name:          member.Id,
		CreatedTime:   member.CreatedTime,
		UpdatedTime:   member.LastActionDate,
		Id:            strconv.Itoa(member.No),
		Type:          "normal-user",
		Password:      member.Password,
		DisplayName:   member.Id,
		Avatar:        member.Avatar,
		Email:         member.Email,
		Phone:         member.Phone,
		Affiliation:   member.Company,
		Tag:           member.CompanyTitle,
		Language:      member.Language,
		Score:         member.Score,
		IsAdmin:       member.IsModerator,
		IsGlobalAdmin: false,
		IsForbidden:   false,
		Github:        member.GithubAccount,
		Google:        member.GoogleAccount,
		QQ:            member.QQOpenId,
		WeChat:        member.WechatOpenId,
		Properties:    properties,
	}
	return user
}

func CreateMemberFromCasdoorUser(user *auth.User) *Member {
	if user == nil {
		return nil
	}

	no, _ := strconv.Atoi(user.Id)
	fileQuota, _ := strconv.Atoi(user.Properties["fileQuota"])
	renameQuota, _ := strconv.Atoi(user.Properties["renameQuota"])

	return &Member{
		Id:                 user.Name,
		CreatedTime:        user.CreatedTime,
		LastActionDate:     user.UpdatedTime,
		No:                 no,
		Password:           user.Password,
		Avatar:             user.Avatar,
		Email:              user.Email,
		Phone:              user.Phone,
		Company:            user.Affiliation,
		CompanyTitle:       user.Tag,
		Language:           user.Language,
		Score:              user.Score,
		IsModerator:        user.IsAdmin,
		GithubAccount:      user.Github,
		GoogleAccount:      user.Google,
		QQOpenId:           user.QQ,
		WechatOpenId:       user.WeChat,
		Tagline:            user.Properties["tagline"],
		Bio:                user.Properties["bio"],
		Website:            user.Properties["website"],
		Location:           user.Properties["location"],
		CheckinDate:        user.Properties["checkinDate"],
		EmailVerifiedTime:  user.Properties["emailVerifiedTime"],
		PhoneVerifiedTime:  user.Properties["phoneVerifiedTime"],
		QQAccount:          user.Properties["oauth_QQ_displayName"],
		QQVerifiedTime:     user.Properties["oauth_QQ_verifiedTime"],
		FileQuota:          fileQuota,
		WechatAccount:      user.Properties["oauth_WeChat_displayName"],
		WechatVerifiedTime: user.Properties["oauth_WeChat_verifiedTime"],
		EditorType:         user.Properties["editorType"],
		RenameQuota:        renameQuota,
	}
}

func ConvertFromCasdoorUsers(users []*auth.User) []*Member {
	var members []*Member
	var member *Member

	for _, user := range users {
		member = CreateMemberFromCasdoorUser(user)
		members = append(members, member)
	}

	return members
}

func GetMembersFromCasdoor() []*Member {
	users, err := auth.GetUsers()
	if err != nil {
		panic(err)
	}

	return ConvertFromCasdoorUsers(users)
}

func minInt(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func Limit(members []*Member, start, limit int) []*Member {
	if start >= len(members) {
		return nil
	}

	end := minInt(len(members), start+limit)
	return members[start:end]
}

func GetMemberFromCasdoor(id string) *Member {
	user, err := auth.GetUser(id)
	if err != nil {
		return nil
	}

	return CreateMemberFromCasdoorUser(user)
}

func UpdateMemberToCasdoor(member *Member) bool {
	if member == nil {
		return false
	}

	user := CreateCasdoorUserFromMember(member)
	ok, err := auth.UpdateUser(*user)
	if err != nil {
		panic(err)
	}
	return ok
}

func UpdateMembersToCasdoor(members []*Member) bool {
	for _, member := range members {
		if !UpdateMemberToCasdoor(member) {
			return false
		}
	}
	return true
}

func AddMemberToCasdoor(member *Member) bool {
	if member == nil {
		return false
	}

	user := CreateCasdoorUserFromMember(member)
	ok, err := auth.AddUser(*user)
	if err != nil {
		panic(err)
	}
	return ok
}

func DeleteMemberFromCasdoor(id string) bool {
	user, err := auth.GetUser(id)
	if err != nil {
		panic(err)
	}

	ok, err := auth.DeleteUser(*user)
	if err != nil {
		panic(err)
	}
	return ok
}

func GetMemberAvatarMapping() map[string]string {
	members := GetMembersFromCasdoor()
	memberAvatar := make(map[string]string)
	for _, member := range members {
		memberAvatar[member.Id] = member.Avatar
	}
	return memberAvatar
}
