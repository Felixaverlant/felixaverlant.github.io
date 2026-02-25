/**
 * Searchable team picker - replaces Chosen select for Baseball Score Calendar.
 * Load after dist-cal/js/bundle.js (provides d3, draw_calendar).
 */
(function() {
  var teams = [];

  function getDisplayName(row) {
    var loc = row.loc_team_tx || '';
    var name = row.name_team_tx || '';
    return (loc + ' ' + name).trim() || row.team_id;
  }

  function filterTeams(query) {
    if (!query || !query.trim()) return teams;
    var q = query.toLowerCase().trim();
    return teams.filter(function(t) {
      var display = getDisplayName(t).toLowerCase();
      var id = (t.team_id || '').toLowerCase();
      return display.indexOf(q) !== -1 || id.indexOf(q) !== -1;
    });
  }

  function renderDropdown(filtered, highlightIndex) {
    var list = document.getElementById('team-picker-list');
    list.innerHTML = '';

    if (filtered.length === 0) {
      var li = document.createElement('div');
      li.className = 'team-picker-option no-results';
      li.textContent = 'No team found';
      list.appendChild(li);
      return;
    }

    filtered.forEach(function(team, i) {
      var li = document.createElement('div');
      li.className = 'team-picker-option' + (i === highlightIndex ? ' highlighted' : '');
      li.textContent = getDisplayName(team);
      li.dataset.teamId = team.team_id;
      li.addEventListener('click', function() {
        selectTeam(team);
      });
      list.appendChild(li);
    });
  }

  function selectTeam(team) {
    var input = document.getElementById('team-picker-input');
    var dropdown = document.getElementById('team-picker-dropdown');
    input.value = getDisplayName(team);
    input.classList.add('has-value');
    dropdown.classList.remove('open');

    if (typeof draw_calendar === 'function') {
      var svg = document.querySelector('.viz svg');
      if (svg) svg.remove();
      draw_calendar(team.team_id);
    }
  }

  function initPicker() {
    d3.csv('dist-cal/data/teams.csv', function(err, csv) {
      if (err) {
        console.error('Failed to load teams', err);
        return;
      }
      teams = csv.filter(function(row) {
        return row && row.team_id;
      });

      var input = document.getElementById('team-picker-input');
      var dropdown = document.getElementById('team-picker-dropdown');
      var list = document.getElementById('team-picker-list');

      var highlightIndex = 0;

      function showDropdown() {
        dropdown.classList.add('open');
        var filtered = filterTeams(input.value);
        highlightIndex = 0;
        renderDropdown(filtered, highlightIndex);
      }

      function hideDropdown() {
        setTimeout(function() {
          dropdown.classList.remove('open');
        }, 150);
      }

      input.addEventListener('focus', showDropdown);
      input.addEventListener('input', function() {
        input.classList.remove('has-value');
        showDropdown();
      });
      input.addEventListener('blur', hideDropdown);
      input.addEventListener('keydown', function(e) {
        var filtered = filterTeams(input.value);
        if (!dropdown.classList.contains('open')) {
          if (e.key === 'ArrowDown' || e.key === 'Enter') showDropdown();
          return;
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          highlightIndex = Math.min(highlightIndex + 1, filtered.length - 1);
          renderDropdown(filtered, highlightIndex);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          highlightIndex = Math.max(highlightIndex - 1, 0);
          renderDropdown(filtered, highlightIndex);
        } else if (e.key === 'Enter' && filtered[highlightIndex]) {
          e.preventDefault();
          selectTeam(filtered[highlightIndex]);
        } else if (e.key === 'Escape') {
          dropdown.classList.remove('open');
        }
      });

      dropdown.addEventListener('mousedown', function(e) {
        e.preventDefault();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPicker);
  } else {
    initPicker();
  }
})();
