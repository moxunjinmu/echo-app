class User {
  final String userId;
  final String? nickname;
  final String? avatarUrl;
  final DateTime? vipExpireAt;

  User({
    required this.userId,
    this.nickname,
    this.avatarUrl,
    this.vipExpireAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      userId: json['user_id'],
      nickname: json['nickname'],
      avatarUrl: json['avatar_url'],
      vipExpireAt: json['vip_expire_at'] != null
          ? DateTime.parse(json['vip_expire_at'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'user_id': userId,
      'nickname': nickname,
      'avatar_url': avatarUrl,
      'vip_expire_at': vipExpireAt?.toIso8601String(),
    };
  }
}
