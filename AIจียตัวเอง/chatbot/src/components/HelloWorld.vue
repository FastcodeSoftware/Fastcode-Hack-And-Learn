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
          <!-- Avatar บอท -->
          <div v-if="msg.role === 'assistant'" class="ig-bot-avatar-wrapper">
            <img
              :src="botAvatar"
              alt="ice"
              class="ig-bot-avatar"
              :class="{ talking: isBotTalking && index === visibleMessages.length - 1 }"
            />
          </div>
  
          <!-- ข้อความ -->
          <div class="ig-message-content">
            {{ msg.content }}
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
