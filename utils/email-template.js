export const welcomeEmailTemplate = (fullname, ctaUrl) => `
<div style="background: #e8f0fe; padding: 40px 20px; min-height: 100vh; font-family:  sans-serif, Arial;">
  <div style="max-width: 580px; margin: 0 auto;">

    <!-- Card -->
    <div style="background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #c7d9f5;">

      <!-- Header Band -->
      <div style="background: linear-gradient(135deg, #0d47a1 0%, #1976d2 60%, #42a5f5 100%); padding: 40px 36px 32px; position: relative; overflow: hidden;">

        <!-- Decorative circles -->
        <div style="position: absolute; top: -30px; right: -30px; width: 130px; height: 130px; border-radius: 50%; background: rgba(255,255,255,0.08);"></div>
        <div style="position: absolute; bottom: -20px; right: 50px; width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.05);"></div>

        <!-- Logo placeholder -->
        <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.15); padding: 6px 14px; border-radius: 20px; margin-bottom: 28px;">
          <img src="{{logoUrl}}" alt="Logo" width="20" height="20" style="border-radius: 4px;" />
          <span style="color: #ffffff; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">HomeFind</span>
        </div>

        <!-- Greeting -->
        <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 8px; font-family: Georgia, serif; line-height: 1.2;">Welcome, ${fullname} 👋</h1>
        <p style="color: rgba(255,255,255,0.82); font-size: 15px; margin: 0; line-height: 1.6;">Your journey to the perfect home starts right here.</p>
      </div>

      <!-- Body -->
      <div style="padding: 32px 36px;">

        <!-- Intro text -->
        <p style="color: #3d4966; font-size: 15px; line-height: 1.75; margin: 0 0 28px;">
          We're thrilled to have you on board. Explore verified listings, save your favourites, and connect with trusted agents — all in one place.
        </p>

        <!-- Feature Cards -->
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px;">

          <div style="display: flex; align-items: center; gap: 14px; background: #f0f5ff; border-radius: 12px; padding: 14px 18px; border-left: 4px solid #1976d2;">
            <div style="width: 36px; height: 36px; background: #1976d2; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
              <img src="https://img.icons8.com/ios-filled/18/ffffff/home.png" width="18" height="18" alt="" />
            </div>
            <div>
              <p style="margin: 0; color: #0d47a1; font-size: 14px; font-weight: 600;">Browse verified listings</p>
              <p style="margin: 4px 0 0; color: #5c6f99; font-size: 13px;">Thousands of curated homes updated daily</p>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 14px; background: #f0f5ff; border-radius: 12px; padding: 14px 18px; border-left: 4px solid #1565c0;">
            <div style="width: 36px; height: 36px; background: #1565c0; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
              <img src="https://img.icons8.com/ios-filled/18/ffffff/like.png" width="18" height="18" alt="" />
            </div>
            <div>
              <p style="margin: 0; color: #0d47a1; font-size: 14px; font-weight: 600;">Save favourite properties</p>
              <p style="margin: 4px 0 0; color: #5c6f99; font-size: 13px;">Bookmark and compare homes at a glance</p>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 14px; background: #f0f5ff; border-radius: 12px; padding: 14px 18px; border-left: 4px solid #42a5f5;">
            <div style="width: 36px; height: 36px; background: #42a5f5; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
              <img src="https://img.icons8.com/ios-filled/18/ffffff/user.png" width="18" height="18" alt="" />
            </div>
            <div>
              <p style="margin: 0; color: #0d47a1; font-size: 14px; font-weight: 600;">Connect with trusted agents</p>
              <p style="margin: 4px 0 0; color: #5c6f99; font-size: 13px;">Direct messaging with verified professionals</p>
            </div>
          </div>

        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin-bottom: 36px;">
          <a href="${ctaUrl}"
             style="display: inline-block; background: linear-gradient(135deg, #0d47a1, #1976d2); color: #ffffff; padding: 15px 36px; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 15px; letter-spacing: 0.3px;">
            Start Exploring Homes &rarr;
          </a>
        </div>

        <!-- Section Divider -->
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
          <div style="flex: 1; height: 1px; background: #dde6f5;"></div>
          <span style="font-size: 11px; color: #8fa3cc; letter-spacing: 1.2px; text-transform: uppercase; font-weight: 600;">Featured Homes</span>
          <div style="flex: 1; height: 1px; background: #dde6f5;"></div>
        </div>

        <!-- Property Cards -->
        <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 32px;">

          <div style="display: flex; gap: 14px; align-items: center; background: #f7faff; border-radius: 12px; padding: 14px; border: 1px solid #dde6f5;">
            <img src="{{propertyImage1}}" width="80" height="70" style="border-radius: 8px; object-fit: cover; flex-shrink: 0;" alt="{{propertyTitle1}}" />
            <div style="flex: 1;">
              <p style="margin: 0 0 4px; color: #0d47a1; font-size: 14px; font-weight: 600;">{{propertyTitle1}}</p>
              <p style="margin: 0; color: #6b82aa; font-size: 13px;">📍 {{propertyLocation1}}</p>
            </div>
            <div style="background: #e3f0ff; color: #1565c0; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; white-space: nowrap;">New</div>
          </div>

          <div style="display: flex; gap: 14px; align-items: center; background: #f7faff; border-radius: 12px; padding: 14px; border: 1px solid #dde6f5;">
            <img src="{{propertyImage2}}" width="80" height="70" style="border-radius: 8px; object-fit: cover; flex-shrink: 0;" alt="{{propertyTitle2}}" />
            <div style="flex: 1;">
              <p style="margin: 0 0 4px; color: #0d47a1; font-size: 14px; font-weight: 600;">{{propertyTitle2}}</p>
              <p style="margin: 0; color: #6b82aa; font-size: 13px;">📍 {{propertyLocation2}}</p>
            </div>
            <div style="background: #e3f0ff; color: #1565c0; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; white-space: nowrap;">Featured</div>
          </div>

        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #e5edf8; padding-top: 24px; text-align: center;">
          <p style="color: #8fa3cc; font-size: 13px; margin: 0 0 10px; line-height: 1.6;">
            You received this because you signed up on our platform.
          </p>
          <p style="margin: 0 0 16px;">
            <a href="{{websiteLink}}" style="color: #1976d2; text-decoration: none; font-size: 13px; font-weight: 500;">Visit Website</a>
            <span style="color: #c5d3e8; margin: 0 8px;">|</span>
            <a href="{{unsubscribeLink}}" style="color: #8fa3cc; text-decoration: none; font-size: 13px;">Unsubscribe</a>
          </p>
          <p style="color: #b0c2de; font-size: 12px; margin: 0;">&copy; 2026 HomeFind. All rights reserved.</p>
        </div>

      </div>
    </div>

  </div>
</div>
`;

export const passwordResetEmailTemplate = (fullname, ctaUrl, resetToken) => `
<div style="background: #e8f0fe; padding: 40px 20px; font-family: Arial, sans-serif;">
  <div style="max-width: 580px; margin: 0 auto;">

    <div style="background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #c7d9f5;">

      <!-- Header -->
      <div style="background: linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%); padding: 40px 36px 36px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -40px; left: -40px; width: 160px; height: 160px; border-radius: 50%; background: rgba(255,255,255,0.06);"></div>
        <div style="position: absolute; bottom: -20px; right: -20px; width: 100px; height: 100px; border-radius: 50%; background: rgba(255,255,255,0.05);"></div>

        <!-- Logo -->
        <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.15); padding: 6px 14px; border-radius: 20px; margin-bottom: 32px;">
          <img src="{{logoUrl}}" alt="Logo" width="18" height="18" style="border-radius: 4px;" />
          <span style="color: #ffffff; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">HomeFind</span>
        </div>

        <!-- Lock Icon -->
        <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.15); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; border: 1.5px solid rgba(255,255,255,0.25);">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="#fff" stroke-width="2"/>
            <path d="M8 11V7a4 4 0 018 0v4" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="16" r="1.5" fill="#fff"/>
          </svg>
        </div>

        <h1 style="color: #ffffff; font-size: 26px; font-weight: 700; margin: 0 0 8px; font-family: Georgia, serif; line-height: 1.2;">Password Reset Request</h1>
        <p style="color: rgba(255,255,255,0.78); font-size: 14px; margin: 0; line-height: 1.6;">We received a request to reset your password.</p>
      </div>

      <!-- Body -->
      <div style="padding: 32px 36px;">

        <p style="color: #3d4966; font-size: 15px; line-height: 1.75; margin: 0 0 24px;">
          Hi <strong style="color: #0d47a1;">${fullname}</strong>, use the button below to reset your password. This link is valid for <strong style="color: #0d47a1;">15 minutes</strong> and can only be used once.
        </p>

        <!-- Token Box -->
        <div style="background: #f0f5ff; border: 1px dashed #90b8e8; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px; text-align: center;">
          <p style="color: #5c7ab0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.4px; font-weight: 600; margin: 0 0 10px;">Your reset token</p>
          <p style="color: #0d47a1; font-size: 22px; font-weight: 700; letter-spacing: 6px; margin: 0; font-family: 'Courier New', monospace;">${resetToken}</p>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin-bottom: 28px;">
          <a href="${ctaUrl}"
             style="display: inline-block; background: linear-gradient(135deg, #0d47a1, #1976d2); color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 15px; letter-spacing: 0.3px;">
            Reset My Password &rarr;
          </a>
        </div>

        <!-- Expiry Warning -->
        <div style="display: flex; align-items: flex-start; gap: 12px; background: #fff8e1; border-left: 4px solid #f9a825; border-radius: 0 10px 10px 0; padding: 14px 18px; margin-bottom: 28px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="flex-shrink:0; margin-top: 1px;" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#f9a825" stroke-width="2"/>
            <path d="M12 7v5l3 3" stroke="#f9a825" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p style="color: #7a5e00; font-size: 13px; margin: 0; line-height: 1.6;">
            This link expires in <strong>15 minutes</strong>. If you didn't request a password reset, you can safely ignore this email — your account remains secure.
          </p>
        </div>

        <!-- Steps -->
        <div style="margin-bottom: 32px;">
          <p style="color: #5c6f99; font-size: 12px; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 600; margin: 0 0 14px;">How it works</p>

          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #1976d2; color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">1</div>
            <p style="margin: 0; color: #3d4966; font-size: 14px;">Click the reset button above</p>
          </div>

          <div style="display: flex; align-items: center; gap: 14px; padding: 4px 0 4px 8px;">
            <div style="width: 1px; height: 16px; background: #c7d9f5; margin-left: 13px;"></div>
          </div>

          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #1565c0; color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">2</div>
            <p style="margin: 0; color: #3d4966; font-size: 14px;">Enter and confirm your new password</p>
          </div>

          <div style="display: flex; align-items: center; gap: 14px; padding: 4px 0 4px 8px;">
            <div style="width: 1px; height: 16px; background: #c7d9f5; margin-left: 13px;"></div>
          </div>

          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #0d47a1; color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">3</div>
            <p style="margin: 0; color: #3d4966; font-size: 14px;">Log in with your new credentials</p>
          </div>
        </div>

        <!-- Security Notice -->
        <div style="display: flex; align-items: flex-start; gap: 12px; background: #f0f5ff; border-radius: 10px; padding: 14px 18px; margin-bottom: 32px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="flex-shrink:0; margin-top:1px;" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6l-8-4z" stroke="#1976d2" stroke-width="2" stroke-linejoin="round"/>
            <path d="M9 12l2 2 4-4" stroke="#1976d2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p style="color: #1a3a6b; font-size: 13px; margin: 0; line-height: 1.6;">
            For your security, HomeFind will <strong>never</strong> ask for your password via email, phone, or chat.
          </p>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #e5edf8; padding-top: 24px; text-align: center;">
          <p style="color: #8fa3cc; font-size: 13px; margin: 0 0 10px; line-height: 1.6;">
            You received this because a password reset was requested for your account.
          </p>
          <p style="margin: 0 0 14px;">
            <a href="{{websiteLink}}" style="color: #1976d2; text-decoration: none; font-size: 13px; font-weight: 500;">Visit Website</a>
            <span style="color: #c5d3e8; margin: 0 8px;">|</span>
            <a href="{{supportLink}}" style="color: #1976d2; text-decoration: none; font-size: 13px; font-weight: 500;">Contact Support</a>
            <span style="color: #c5d3e8; margin: 0 8px;">|</span>
            <a href="{{unsubscribeLink}}" style="color: #8fa3cc; text-decoration: none; font-size: 13px;">Unsubscribe</a>
          </p>
          <p style="color: #b0c2de; font-size: 12px; margin: 0;">&copy; 2026 HomeFind. All rights reserved.</p>
        </div>

      </div>
    </div>

  </div>
</div>
`;