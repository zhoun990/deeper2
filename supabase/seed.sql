-- Userテーブルにデータを挿入
INSERT INTO
    "User" ("id", "name", "bio", "role")
VALUES
    ('1', 'Alice', 'こんにちは！', 'USER'),
    ('2', 'Bob', '初めまして、Bobです！', 'USER'),
    ('3', 'Charlie', '映画が大好き！', 'USER'),
    ('4', 'David', 'プログラミングが趣味です！', 'USER');

-- Favoriteテーブルにデータを挿入
INSERT INTO
    "Favorite" ("permissionLevel", "toId", "fromId")
VALUES
    (0, '1', '2'),
    (1, '2', '1'),
    (0, '1', '3'),
    (0, '2', '4');

-- Postテーブルにデータを挿入
INSERT INTO
    "Post" ("public", "follower", "text", "authorId")
VALUES
    (1, 0, '今日はいい天気ですね！', '1'),
    (0, 1, 'プライベートな投稿です。', '2'),
    (1, 0, '最近見た映画はとても面白かった！', '3'),
    (1, 0, '新しいプログラミング言語を勉強中。', '4');

-- Permissionテーブルにデータを挿入
INSERT INTO
    "Permission" ("level", "postId", "userId")
VALUES
    (0, 1, '1'),
    (1, 2, '2'),
    (1, 3, '3'),
    (0, 4, '4');

-- Groupテーブルにデータを挿入
INSERT INTO
    "Group" (
        "title",
        "description",
        "allowJoin",
        "isPublic",
        "isPrimary"
    )
VALUES
    ('グループ1', '素晴らしいグループ!', true, false, false),
    ('グループ2', '楽しいメンバーが集まるグループ', true, true, false);

-- GroupMemberテーブルにデータを挿入
INSERT INTO
    "GroupMember" ("memberId", "groupId", "hidden")
VALUES
    ('1', 1, false),
    ('2', 1, false),
    ('1', 2, true),
    ('3', 2, false),
    ('4', 2, false);