<template>
  <div class="iphone-frame">
    <div class="ig-chat-container">
      <!-- Header คล้าย Instagram -->
      <div class="ig-chat-header">
        <div class="ig-header-left">
          <span class="ig-back-icon">←</span>
          <span class="ig-header-title">ฟีฟ่า</span>
        </div>
        <div class="ig-header-right">
          <span class="ig-menu-icon">⋮</span>
        </div>
      </div>

      <!-- ส่วนแสดงข้อความ -->
      <div class="ig-chat-log">
        <div
          v-for="(msg, index) in visibleMessages"
          :key="index"
          :class="['ig-message', msg.role]"
        >
          <!-- Assistant message -->
          <template v-if="msg.role === 'assistant'">
            <div class="ig-message-row">
              <div class="ig-bot-avatar-wrapper">
                <img
                  :src="botAvatar"
                  alt="Bot Avatar"
                  class="ig-bot-avatar"
                />
              </div>
              <div class="ig-message-content assistant">
                <img
                  v-if="msg.sticker"
                  :src="msg.sticker"
                  class="sticker-img"
                  alt="Sticker"
                />
                <div v-else class="ig-message-bubble">{{ msg.content }}</div>
              </div>
            </div>
          </template>

          <!-- User message -->
          <template v-else>
            <div class="ig-message-content user">
              <div class="ig-message-bubble">{{ msg.content }}</div>
            </div>
          </template>
        </div>

        <!-- Typing indicator -->
        <div v-if="isBotTyping" class="typing-indicator-wrapper">
          <div class="ig-bot-avatar-wrapper">
            <img
              :src="botAvatar"
              alt="Bot Avatar"
              class="ig-bot-avatar"
            />
          </div>
          <div class="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <!-- ส่วนกรอกข้อความ -->
      <div class="ig-input-area">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          class="ig-chat-input"
          type="text"
          placeholder="พิมพ์ข้อความของคุณ..."
        />
        <button class="ig-send-button" @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<style scoped src="./Final.css"></style>
<script src="./Final.js"></script>
