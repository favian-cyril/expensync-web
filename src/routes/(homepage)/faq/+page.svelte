<script lang="ts">
</script>

<div class="max-w-3xl my-10 mx-auto gap-4 flex-col flex">
    <div class="text-2xl">Frequently Asked Questions</div>
    <div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
        <div class="collapse-title text-xl font-medium">
          How does it work?
        </div>
        <div class="collapse-content">
          <p>ExpenSync works by creating forwarding filter to automatically forward receipt emails which will be parsed automatically.</p>
        </div>
      </div>
      <div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
        <div class="collapse-title text-xl font-medium">
          Why does it require gmail account access?
        </div>
        <div class="collapse-content">
          <p>Gmail account access is currenly used to be able to modify filter that are used to forward emails. We will not change user settings without user's input, everytime we access the user's settings it will ask for the user's consent.</p>
        </div>
      </div>
      <div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
        <div class="collapse-title text-xl font-medium">
          How do I make sure that I don't forward emails outside of the filters?
        </div>
        <div class="collapse-content">
          <p>You can check what emails are forwarded by clicking edit filters in the gmail settings. This will show all the emails that are forwarded based on the filters.</p>
        </div>
      </div>
      <div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
        <div class="collapse-title text-xl font-medium">
          Can I use emails outside of gmail?
        </div>
        <div class="collapse-content">
          <p>Currently only gmail are supported but we plan to add a manual setup so that any email address are able to use ExpenSync.</p>
        </div>
      </div>
      <div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
        <div class="collapse-title text-xl font-medium">
          Does this mean that my emails will be saved?
        </div>
        <div class="collapse-content">
          <p>There is an option to opt-out of saving email content in the user options. Doing so will disable the option to review email content when reviewing receipt and opt-out of improving the accuracy of the AI model.</p>
        </div>
      </div>
      <div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
        <div class="collapse-title text-xl font-medium">
          What is the purpose of storing email content?
        </div>
        <div class="collapse-content">
          <p>Email content is stored so that users can easily review and verify if the information is correct, it will also be used to further improve the accuracy of category tagging and value extraction. Email receipt usually don't contain sensitive information such as full credit card number or personal info but if you feel like it has sensitive information you can choose to turn off this feature.</p>
        </div>
      </div>
</div>