<template>
  <dialog ref="modal" class="modal modal-bottom md:modal-middle">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-5 top-5">✕</button>
      </form>
      <h3 class="font-bold text-lg">Import Save File</h3>
      <p class="py-4">Import a save file to automatically load in your friendship points, current in-game date, and item quantities.</p>
      <p class="text-sm italic">Note: friendship points and item quantities will only update for the villagers you are currently tracking.</p>
      <div class="divider"></div>

      <div role="tablist" class="tabs tabs-lifted">
        <input type="radio" name="apple" role="tab" class="tab" aria-label="MacOS" checked />
        <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <ul class="space-y-3 p-3">
            <li>1. Open Finder and select "Go" in the upper menu bar.</li>

            <li>2. In the "Go" menu, select "Go to Folder"</li>
            <li>3. Enter the following file path:</li>
            <li><code class="bg-base-300 ml-4">~/.config/StardewValley/Saves</code></li>
            <li>4. Select a save folder, and choose the file that takes the following format:</li>
            <li><code class="bg-base-300 ml-4">{player name}_{lots of numbers}</code></li>
            <li>5. Submit the file down below.</li>
          </ul>
        </div>
        <input type="radio" name="apple" role="tab" class="tab" aria-label="Windows" />
        <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <ul class="space-y-3 p-3">
            <li class="flex items-center">
              1. Press
              <kbd class="kbd mx-2"><font-awesome-icon icon="fa-brands fa-windows" /></kbd> + <kbd class="kbd mx-2">r</kbd> to open "Run"
            </li>
            <li>2. In the resulting text field, enter the following file path:</li>
            <li><code class="bg-base-300 ml-4">%appdata%\StardewValley\Saves</code></li>
            <li>3. Select a save folder, and choose the file that takes the following format:</li>
            <li><code class="bg-base-300 ml-4">{player name}_{lots of numbers}</code></li>
            <li>4. Submit the file down below.</li>
          </ul>
        </div>
      </div>
      <div class="mt-3"></div>
      <a class="text-sm italic hover:brightness-75" href="https://stardewvalleywiki.com/Saves" target="_blank">
        Click here if you are unable to locate your save file based on the provided instructions.
      </a>
      <div class="modal-action flex justify-between">
        <input
          type="file"
          :class="['file-input w-full max-w-xs bg-base-200 hover:brightness-90', fileError ? 'input-error' : '']"
          @change="handleFileUpload"
        />
        <button :class="['btn', isFileLoading ? 'loading' : '']" @click="submitSaveFile">Import</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { useStore } from '@/store';
import { type Ref, ref } from 'vue';
import { XMLParser } from 'fast-xml-parser';
import { Season } from '@/models';

const isFileLoading = ref(false);
const fileError = ref(false);
const saveFile: Ref<File | null> = ref(null);
const modal = ref({} as HTMLDialogElement);

const store = useStore();

function handleFileUpload(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  if (inputElement.files) {
    const file = inputElement.files[0];
    saveFile.value = file;
    fileError.value = false;
  }
}

function submitSaveFile() {
  if (!saveFile.value) {
    fileError.value = true;
    return;
  }
  isFileLoading.value = true;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const xml = event.target?.result;
      const parser = new XMLParser();
      const parsedXML = parser.parse(xml);

      const friendshipData = parsedXML.SaveGame.player.friendshipData.item.map((entry: any) => {
        const { key, value } = entry;
        const { string: name } = key;
        const { Friendship: friendship } = value;
        const { Points: friendshipPoints, Status: status } = friendship;
        return { name, friendshipPoints, status };
      });

      const day = parsedXML.SaveGame.player.dayOfMonthForSaveGame;
      const season = parsedXML.SaveGame.player.seasonForSaveGame;
      store.addSaveFileData(friendshipData, { season: convertSeasonToString(season), day: day });
      isFileLoading.value = false;
      modal.value.close();
    } catch (error) {
      console.log(error);
      fileError.value = true;
      isFileLoading.value = false;
    }
  };

  reader.readAsText(saveFile.value);
}

const convertSeasonToString = (season: 1 | 2 | 3 | 4): Season => {
  switch (season) {
    case 1:
      return Season.SPRING;
    case 2:
      return Season.SUMMER;
    case 3:
      return Season.FALL;
    case 4:
      return Season.WINTER;
  }
};

defineExpose({ showModal: () => modal.value.showModal(), closeModal: () => modal.value.close() });
</script>
