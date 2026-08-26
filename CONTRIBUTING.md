# Contributing to Stasis Web

First off, thank you for considering contributing to Stasis! It's people like you that make Stasis such a great tool.

## Where do I go from here?

If you've noticed a bug or have a feature request, make one! It's generally best if you get confirmation of your bug or approval for your feature request this way before starting to code.

## Fork & create a branch

If this is something you think you can fix, then fork Stasis and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on): `issue-325-add-dark-mode`

## Get the test suite running

Make sure you're using the correct Node version and install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help; everyone is a beginner at first.

## Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with Stasis's master branch:

```bash
git remote add upstream git@github.com:your-username/Stasis-web.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```bash
git checkout issue-325-add-dark-mode
git rebase master
git push --set-upstream origin issue-325-add-dark-mode
```

Finally, go to GitHub and make a Pull Request!

## Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

## Merging a PR (maintainers only)

A PR can only be merged into master by a maintainer if:

- It is passing CI.
- It has been approved by at least two maintainers.
- It has no requested changes.
- It is up to date with current master.
